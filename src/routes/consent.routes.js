const express = require('express');
const router = express.Router();
const consentController = require('../controllers/consent.controller');

// Generar PDF de consentimiento
router.post('/generate-pdf', consentController.generateConsentPDF);

// Guardar consentimiento
router.post('/save', consentController.saveConsent);

module.exports = router;
