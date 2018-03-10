const mysql = require("mysql");

const connexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "taskit"
});
connexion.connect();

module.exports = connexion;
