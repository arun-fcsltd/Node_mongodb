const express = require('express');
const { createMaterial, getMaterials } = require('../controllers/materialController');

const router = express.Router();

router.post('/materials', createMaterial);
router.get('/materials', getMaterials);

module.exports = router;
