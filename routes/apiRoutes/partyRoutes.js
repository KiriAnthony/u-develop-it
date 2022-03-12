const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// get all parties
router.get('/parties', (req, res) => {
    // create var to select all parties
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        // handle error
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        // display message and data
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get single party
router.get('/parties/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// delete a single party and set value to null in related tables
router.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({error: res.message});
            // check if anything deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;