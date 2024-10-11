const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoiceController');

// Define routes for invoice CRUD operations
router.post('/invoices', invoicesController.createInvoice);       // Create an invoice
router.get('/invoices', invoicesController.getAllInvoices);       // Get all invoices
router.get('/invoices/:id', invoicesController.getInvoiceById);   // Get a specific invoice by ID
router.put('/invoices/:id', invoicesController.updateInvoice);    // Update an invoice by ID
router.delete('/invoices/:id', invoicesController.deleteInvoice); // Delete an invoice by ID

module.exports = router;
