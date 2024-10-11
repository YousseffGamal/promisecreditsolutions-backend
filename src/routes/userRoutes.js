const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser , getAllInvoicesForUser, getInvoiceForUser } = require('../controllers/userController'); // Ensure updateUser is imported correctly
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Admin can get all users
router.route('/').get(protect, admin, getAllUsers);

// User-specific actions: Get by ID, Update, Delete
router.route('/:id')
// User-specific actions: Get by ID, Update, Delete
router.route('/:id')
    .get(protect, getUserById) // Protect this route to ensure only authenticated users can access
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);


router.route('/:id/invoices').get(protect, getAllInvoicesForUser); // Protect this route for authenticated users

// Get a single invoice for a user by invoice ID
router.route('/:userId/invoices/:invoiceId').get(protect, getInvoiceForUser); // Protect this route for authenticated users


module.exports = router;
