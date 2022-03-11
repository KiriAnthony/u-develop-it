// connecting to MySQL database
const mysql = require('mysql2');

// input function to check input for post request
const inputCheck = require('./utils/inputCheck');

// create the express connection
const express = require('express');
const res = require('express/lib/response');
const { run } = require('jest');
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


// delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    // creating var to delete a specified candidate
    const sql = `DELETE FROM candidates WHERE id = ?`;
    // accepting user input on which candidate to delete
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        // handling error
        if(err) { // display message if candidate not found
            res.statusMessage(400).json({error: res.message});
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else { // display message if properly deleted
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// create a candidate using post request
app.post('/api/candidate', ({body}, res) => {
    // checking input
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    // handle error if input incorrect
    if(errors) {
        res.status(400).json({error: errors});
        return;
    }
    // create a candidate
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?,?,?)`;
    // assigning request body values to variable
    const params = [body.first_name, body.last_name, body.industry_connected];
    
    db.query(sql, params, (err, result) => {
        // handle error
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        // display message and data to screen
        res.json({
            message: 'success',
            data: body
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    // creating a var to select a single candidate
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON CANDIDATES.party_id = parties.id
                WHERE id = ?`;
    // accepting user input on which candidate to pull
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        // handling error
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        // displaying message and data to screen
        res.json({
            message: 'sucess',
            data: row
        });
    });
});

// Get all candidates
app.get('/api/candidates', (req, res) => {
    // creates variable to return all data in candidates table
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON CANDIDATES.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        // handle error
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        // displaying message and data to screen
        res.json({
            message: 'success',
            data: rows
        });
    });
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