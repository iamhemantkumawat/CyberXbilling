const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../services/db');

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'user']
    );
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err });
  }
});

module.exports = router;