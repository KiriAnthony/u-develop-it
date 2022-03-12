const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// delete a candidate
router.delete('/candidate/:id', (req, res) => {
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
router.post('/candidate', ({body}, res) => {
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
router.get('/candidate/:id', (req, res) => {
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
router.get('/candidates', (req, res) => {
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

// Update a candidate's party
router.put('/candidate/:id', (req, res) => {
    // validating user input
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }

    // updating the party
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });

module.exports = router;