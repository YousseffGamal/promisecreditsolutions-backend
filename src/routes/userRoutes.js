const express = require('express');
const { getCreditScoreById,
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    getAllInvoicesForUser, 
    getInvoiceForUser, 
    updateCreditScore,
    getUserCount,
    addCreditScore 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Admin can get all users
router.route('/').get(protect, admin, getAllUsers);

// Get the total number of users
router.route('/count').get(protect, admin, getUserCount); // Define this route first

// User-specific actions: Get by ID, Update, Delete
router.route('/:id')
    .get( getUserById) // Now this won't conflict with `/count`
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);



router.route('/:id/invoices').get(protect, getAllInvoicesForUser);
router.route('/:userId/invoices/:invoiceId').get(protect, getInvoiceForUser);
router.route('/:id/credit-score').put(updateCreditScore);

router.route('/:id/credit-score').post(addCreditScore);
router.route('/:id/credit-score').get(protect, getCreditScoreById); // Add GET route for credit score

module.exports = router;
