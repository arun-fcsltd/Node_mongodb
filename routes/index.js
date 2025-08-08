const express = require('express');
const authRoutes = require('./authRoutes');
const materialRoutes = require('./materialRoutes');

const router = express.Router();

router.use('/materials', materialRoutes);

module.exports = router;
