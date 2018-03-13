const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const auth = express.Router();
const task = express.Router();

const connexionBDD = require("./db");
const bcrypt = require('bcrypt');


// Corrige une restriction au niveau du Head
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Chaîne secrete pour crypter les token
const secret = 'EzD5ps3wz5NSEJgLa3BbQha8ewJDr33ZcMLBnn8F86TP38za';

// Traitement des infos du form, envoyés par le component 'Login'
auth.post('/login', (req, res) => {
    if (req.body) {
        let email = req.body.email.toLocaleLowerCase().trim();
        let password = req.body.password.trim();

        connexionBDD.query(
            "SELECT * FROM users WHERE email = ?", [email], (error, result) => {
                if (error) {
                    res.status(401).json({
                        success: false,
                        message: 'Identifiants incorrects'
                    });
                }
                else {
                    if (result.length > 0) {
                        bcrypt.compare(password, result[0].password, (bErr, bRes) => {
                            if (!bRes) {
                                res.status(401).json({
                                    success: false,
                                    message: 'Identifiants incorrects'
                                });
                            }
                            else {
                                let token = jwt.sign({
                                    id: result[0].id,
                                    agent: req.headers['user-agent'],
                                    exp: Math.floor(new Date().getTime()/1000) + (7 * 24 * 60 * 60)
                                }, secret);

                                res.json({
                                    success: true,
                                    token: token
                                });
                            }
                        });
                    }
                    else {
                        res.status(401).json({
                            success: false,
                            message: 'Identifiants incorrects'
                        });
                    }
                }
            }
        );
    }
    else {
        res.status(500).json({
            success: false,
            message: 'Formulaire incomplet'
        });
    }
});

auth.post('/register', (req, res) => {
    let email = req.body.email.toLocaleLowerCase().trim();
    let password = req.body.password.trim();
    let firstname = req.body.firstname.trim();
    let lastname = req.body.lastname.trim();

    if (!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email)) {
        res.status(401).json({
            success: false,
            message: 'L\'email est trop court ou a un format incorrect'
        });
    }
    else if (!/^[a-zA-Z0-9!@#\$%\^&_-]{6,255}$/.test(password)) {
        res.status(401).json({
            success: false,
            message: 'Le mot de passe est trop court ou a un format incorrect'
        });
    }
    else if (!/^[a-zA-Z0-9' _-]{3,30}$/.test(firstname)) {
        res.status(401).json({
            success: false,
            message: 'Le prénom est trop court ou a un format incorrect'
        });
    }
    else if (!/^[a-zA-Z0-9\'\"\!\? _-]{3,30}$/.test(lastname)) {
        res.status(401).json({
            success: false,
            message: 'Le nom est trop court ou a un format incorrect'
        });
    }
    else {
        bcrypt.hash(password, 15, (err, hash) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: 'Le mot de passe n\'a pas pu être enregistré'
                });
            }
            else {
                connexionBDD.query(
                    "INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)", [email, hash, firstname, lastname], (error, result) => {
                        if (result) {
                            res.json({
                                success: true
                            });
                        }
                    }
                );
            }
        });
    }
});

auth.get('/decodetoken/:token', (req, res) => {
    // Le token est passé en GET, récupéré et décodé ici grâce au secret
    // La valeur de retour est un objet user conteannt les infos de la requête

    const token = req.params.token;

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Le token ne correspond pas'
            });
        }
        else {
            let id = decodedToken.id;

            connexionBDD.query(
                "SELECT id, email, firstname, lastname FROM users WHERE id = ?", [id], (error, result) => {
                    if (error) {
                        res.status(500).json({
                            success: false,
                            message: 'La base de donnée est inaccessible'
                        });
                    }
                    else {
                        res.json({
                            data: result[0]
                        });
                    }
                }
            );
        }
    });
});

auth.get('/all', (req, res) => {
    connexionBDD.query(
        "SELECT id, email, firstname, lastname FROM users", (error, result) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'La base de donnée est inaccessible'
                });
            }
            else {
                res.json({
                    data: result
                });
            }
        }
    );
});

task.get('/all', (req, res) => {
    connexionBDD.query(
        "SELECT * FROM task", (error, result) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'La base de donnée est inaccessible'
                });
            }
            else {
                res.json({
                    data: result
                });
            }
        }
    );
});

task.post('/new', (req, res) => {

    let name = req.body.name.trim();
    let description = req.body.description.trim();
    let start_date = req.body.start_date_date;
    let start_date_time = req.body.start_date_time;
    let end_date = req.body.end_date_date;
    let end_date_time = req.body.end_date_time;
    let recurrence = req.body.recurrence.trim();
    let status = req.body.status.trim();
    let assigned_to = req.body.assigned_to.trim();
    let privacy = req.body.privacy.trim();
    let reminder;

    if (req.body.reminder === false) {
        reminder = 0;
    } else {
        reminder = 1;
    }

    connexionBDD.query(
        "INSERT INTO task (name, description, start_date, start_date_time, end_date, end_date_time, recurrence, status, assigned_to, privacy, reminder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, description, start_date, start_date_time, end_date, end_date_time, recurrence, status, assigned_to, privacy, reminder],
        (error, result) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'La base de donnée est inaccessible'
                });
            }
            else {
                res.json({
                    success: true,
                    message: 'La tâche a correctement été crée.'
                });
            }
        }
    )
});

// Modification du chemin
app.use('/auth', auth);
app.use('/task', task);

// PORT
app.listen(4201);
