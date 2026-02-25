const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./database/university.db');

// GET all courses
app.get('/api/courses', (req, res) => {
    db.all('SELECT * FROM courses', [], (err, rows) => {
        if (err) return res.status(500).json(err.message);
        res.json(rows);
    });
});

// GET course by ID
app.get('/api/courses/:id', (req, res) => {
    db.get('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json(err.message);
        if (!row) return res.status(404).json({ message: 'Course not found' });
        res.json(row);
    });
});

// POST new course
app.post('/api/courses', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    db.run(
        `INSERT INTO courses (courseCode, title, credits, description, semester)
         VALUES (?, ?, ?, ?, ?)`,
        [courseCode, title, credits, description, semester],
        function (err) {
            if (err) return res.status(500).json(err.message);
            res.status(201).json({ id: this.lastID });
        }
    );
});

// PUT update course
app.put('/api/courses/:id', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    db.run(
        `UPDATE courses
         SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
         WHERE id = ?`,
        [courseCode, title, credits, description, semester, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err.message);
            if (this.changes === 0) return res.status(404).json({ message: 'Course not found' });
            res.json({ message: 'Course updated successfully' });
        }
    );
});

// DELETE course
app.delete('/api/courses/:id', (req, res) => {
    db.run(
        'DELETE FROM courses WHERE id = ?',
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err.message);
            if (this.changes === 0) return res.status(404).json({ message: 'Course not found' });
            res.json({ message: 'Course deleted successfully' });
        }
    );
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
