const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const auth = express.Router();

// Utilisateurs de test TEMPORAIRE
let users = [{
    id: 1,
    email: 'test@test.fr',
    firstname: 'Charles',
    lastname: 'Climent',
    password: 'test'
}];

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
        const email = req.body.email.toLocaleLowerCase();
        const password = req.body.password;
        const index = users.findIndex(user => user.email === email);

        if (index >= 0 && users[index].password === password) {
            let token = jwt.sign({ iss: 'http://localhost:4201', id: users[index].id }, secret);

            res.json({
                success: true,
                token: token
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

    }
    else {
        res.status(500).json({
            success: false,
            message: 'Formulaire incomplet'
        });
    }
});


// Modification du chemin
app.use('/auth', auth);

// PORT
app.listen(4201);
