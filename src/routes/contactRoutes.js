// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// Define the POST route for contact form submissions
router.post('/', submitContactForm);

module.exports = router;
