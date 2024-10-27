const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoiceController');
const userController = require('../controllers/userController');

// Route to count total number of invoices
router.get('/invoices/count', invoicesController.countInvoices);   // Count total invoices
router.get('/invoices/countPaidInvoices', invoicesController.countPaidInvoices);

// Define routes for invoice CRUD operations
router.post('/invoices', invoicesController.createInvoice);       // Create an invoice
router.get('/invoices', invoicesController.getAllInvoices);       // Get all invoices
router.get('/invoices/:id', invoicesController.getInvoiceById);   // Get a specific invoice by ID
router.put('/invoices/:id', invoicesController.updateInvoice);    // Update an invoice by ID
router.delete('/invoices/:id', invoicesController.deleteInvoice); // Delete an invoice by ID

// Get all invoices for a user
router.get('/users/:id/invoices', userController.getAllInvoicesForUser);

// Get a specific invoice for a user
router.get('/users/:userId/invoices/:invoiceId', userController.getInvoiceForUser);

module.exports = router;
