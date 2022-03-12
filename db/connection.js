// connecting to MySQL database
const mysql = require('mysql2');

// connect to mysql2 database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySql password,
        password: 'Greenocean-1',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;