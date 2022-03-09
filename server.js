// connecting to MySQL database
const mysql = require('mysql2');

// create the express connection
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// add express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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

// GET test to test express connection
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// }); // run by npm start after adding start:node server.js to package.json



// returns all data in candidates table
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

// default response for any other request (Not Found)
// this route overrides all others (Keep as last)
app.use((req, res) => {
    res.status(404).end();
});

// function to start express.js server on port 3001 (bottom of file)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});