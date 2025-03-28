const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const [rows] = await db.execute('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, userId]);
    if (rows.affectedRows === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: `Recharged ₹${amount} to user ID ${userId}` });
  } catch (err) {
    res.status(500).json({ error: 'Recharge failed', details: err });
  }
});

module.exports = router;