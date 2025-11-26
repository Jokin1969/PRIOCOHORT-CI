const express = require('express');
const router = express.Router();
const dniController = require('../controllers/dni.controller');

// Validar DNI
router.post('/validate', dniController.validateDNI);

module.exports = router;
