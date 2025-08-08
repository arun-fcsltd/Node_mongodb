const express = require('express');
const router = express.Router();
// const authRoutes = require('./authRoutes');
const materialRoutes = require('./materialRoutes');
const complaintRoutes = require('./complaintRoutes'); // Import complaintRoutes


router.use('/materials', materialRoutes);

router.use('/complaints', complaintRoutes); // Register complaintRoutes with /complaints prefix


module.exports = router;
