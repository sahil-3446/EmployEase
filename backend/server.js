const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employees_db'
});

// MySQL connect
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        return;
    }

    console.log('MySQL connected successfully!');
});

// Test route
app.get('/test', (req, res) => {
    res.send('API routes are working!');
});

// Home route
app.get('/', (req, res) => {
    res.send('Employee Management System Backend is running!');
});

// Get all employees
app.get('/api/employees', (req, res) => {
    const sql = 'SELECT * FROM employees ORDER BY employee_id DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err.message);
            return res.status(500).json({
                message: 'Failed to fetch employees'
            });
        }

        res.json(results);
    });
});

// Start server
app.post('/api/employees', (req, res) => {
    const { name, email, department, role, salary, status } = req.body;

    if (!name || !email || !department || !role || salary === undefined) {
        return res.status(400).json({
            message: 'Please fill all required fields'
        });
    }

    const sql = `
        INSERT INTO employees (name, email, department, role, salary, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, department, role, salary, status || 'Active'],
        (err, result) => {
            if (err) {
                console.error('Error adding employee:', err.message);
                return res.status(500).json({
                    message: 'Failed to add employee'
                });
            }

            res.status(201).json({
                message: 'Employee added successfully',
                employee_id: result.insertId
            });
        }

    );
});

app.put('/api/employees/:id', (req, res) => {
    const { name, email, department, role, salary, status } = req.body;
    const employeeId = req.params.id;

    if (!name || !email || !department || !role || salary === undefined) {
        return res.status(400).json({
            message: 'Please fill all required fields'
        });
    }

    const sql = `
        UPDATE employees
        SET name = ?, email = ?, department = ?, role = ?, salary = ?, status = ?
        WHERE employee_id = ?
    `;

    db.query(
        sql,
        [name, email, department, role, salary, status || 'Active', employeeId],
        (err, result) => {
            if (err) {
                console.error('Error updating employee:', err.message);
                return res.status(500).json({
                    message: 'Failed to update employee'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Employee not found'
                });
            }

            res.json({ message: 'Employee updated successfully' });
        }
    );
});

app.delete('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;

    const sql = 'DELETE FROM employees WHERE employee_id = ?';

    db.query(sql, [employeeId], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err.message);
            return res.status(500).json({
                message: 'Failed to delete employee'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.json({
            message: 'Employee deleted successfully'
        });
    });
});
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});