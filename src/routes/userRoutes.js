const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController'); // Ensure updateUser is imported correctly
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


module.exports = router;
