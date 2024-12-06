var express = require('express');
var router = express.Router();
var connection = require('../database'); // Import MySQL connection from database.js

// GET - Get all To-Do's (Non-Deleted):
router.get('/', function(req, res) {
    const query = 'SELECT * FROM todo_items WHERE deleted_ts IS NULL'; // Fetch all non-deleted To-Do's.
    connection.query(query, function(err, results) {
        if (err) {
            console.error('ERROR fetching To-Do items:', err);
            return res.status(500).send('ERROR fetching To-Do items');
        }
        res.status(200).json(results); // Should send results as JSON.
    });
});

// POST - Create a new To-Do item:
router.post('/', function(req, res) {
    const { description, completed_ts, created_ts, deleted_ts } = req.body;
    const query = 'INSERT INTO todo_items (description, completed_ts, created_ts, deleted_ts) VALUES (?, ?, ?, ?)';
    connection.query(query, [description, completed_ts, created_ts, deleted_ts], function(err, results) {
        if (err) {
            console.error('ERROR inserting To-Do item:', err);
            return res.status(500).send('ERROR creating To-Do item');
        }
        res.status(201).json({
            id: results.insertId, // Return the new To-Do item's ID.
            description,
            completed_ts,
            created_ts,
            deleted_ts
        });
    });
});

// GET - Get a specific To-Do by ID (Non-Deleted):
router.get('/:id', function(req, res) {
    const todoId = req.params.id;
    const query = 'SELECT * FROM todo_items WHERE id = ?';
    connection.query(query, [todoId], function(err, results) {
        if (err) {
            console.error('ERROR fetching To-Do item:', err);
            return res.status(500).send('ERROR fetching To-Do item');
        }
        if (results.length === 0) {
            return res.status(404).send('To-Do item not found');
        }
        res.status(200).json(results[0]); // Return the To-Do item as JSON.
    });
});

// PUT - Update/Edit a specific To-Do by ID:
router.put('/:id', function(req, res) {
    const todoId = req.params.id;
    const { description, completed_ts, updated_ts, deleted_ts } = req.body;
    const query = 'UPDATE todo_items SET description = ?, completed_ts = ?, updated_ts = ?, deleted_ts = ? WHERE id = ?';
    connection.query(query, [description, completed_ts, updated_ts, deleted_ts, todoId], function(err, results) {
        if (err) {
            console.error('ERROR updating To-Do item:', err);
            return res.status(500).send('ERROR updating To-Do item');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('To-Do item not found');
        }
        res.status(200).send('To-Do item updated');
    });
});

// DELETE - Delete a specific To-Do by ID (soft delete by setting deleted_ts):
router.delete('/:id/delete', function(req, res) {
    const todoId = req.params.id;
    const query = 'UPDATE todo_items SET deleted_ts = NOW() WHERE id = ?';
    connection.query(query, [todoId], function(err, results) {
        if (err) {
            console.error('ERROR deleting To-Do item:', err);
            return res.status(500).send('ERROR deleting To-Do item');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('To-Do item not found');
        }
        res.status(200).send('To-Do item deleted');
    });
});

// POST - Restore a specific deleted To-Do by ID:
router.post('/:id/restore', function(req, res) {
    const todoId = req.params.id;
    const query = 'UPDATE todo_items SET deleted_ts = NULL WHERE id = ?';
    connection.query(query, [todoId], function(err, results) {
        if (err) {
            console.error('ERROR restoring To-Do item:', err);
            return res.status(500).send('ERROR restoring To-Do item');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('To-Do item not found');
        }
        res.status(200).send('To-Do item restored');
    });
});

module.exports = router;