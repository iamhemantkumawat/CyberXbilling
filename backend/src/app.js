require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const rechargeRoutes = require('./routes/recharge');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recharge', rechargeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CyberX Billing backend running on port ${PORT}`);
});