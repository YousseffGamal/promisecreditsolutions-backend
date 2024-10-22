const express = require('express');
const {
    getCreditScoreById,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllInvoicesForUser,
    getInvoiceForUser,
    updateCreditScore,
    getUserCount
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Admin can get all users
router.route('/').get(protect, admin, getAllUsers);

// Get the total number of users
router.route('/count').get(protect, admin, getUserCount); // Define this route first to avoid conflict with `/:id`

// User-specific actions: Get by ID, Update, Delete
router.route('/:id')
    .get(protect, getUserById) // Now this won't conflict with `/count`
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser); // Protect and admin required for delete

// Get all invoices for a specific user
router.route('/:id/invoices').get(protect, getAllInvoicesForUser);

// Get a specific invoice for a user
router.route('/:userId/invoices/:invoiceId').get(protect, getInvoiceForUser);

// Update user's credit score (Admin only)
router.route('/:id/credit-score').put(protect, admin, updateCreditScore);

// Get user's credit score
router.route('/:id/credit-score').get(protect, getCreditScoreById); // Protect route for credit score retrieval

module.exports = router;
