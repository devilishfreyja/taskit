const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const auth = express.Router();

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
        const email = req.body.email.toLocaleLowerCase().trim();
        const password = req.body.password.trim();

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
                                let token = jwt.sign({ iss: 'http://localhost:4201', id: result[0].id }, secret);
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
    const email = req.body.email.toLocaleLowerCase().trim();
    let password = req.body.password.trim();
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();

    if (!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email)) {
        res.status(401).json({
            success: false,
            message: 'L\'email est trop court ou a un format incorrect'
        });
    }
    else if (!/^[a-z0-9_-]{6,255}$/.test(password)) {
        res.status(401).json({
            success: false,
            message: 'Le mot de passe est trop court ou a un format incorrect'
        });
    }
    else if (!/^[a-z0-9_-]{3,30}$/.test(firstname)) {
        res.status(401).json({
            success: false,
            message: 'Le prénom est trop court ou a un format incorrect'
        });
    }
    else if (!/^[a-z0-9_-]{3,30}$/.test(lastname)) {
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
                password = hash;
                connexionBDD.query(
                    "INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)", [email, password, firstname, lastname], (error, result) => {
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

// Modification du chemin
app.use('/auth', auth);

// PORT
app.listen(4201);

