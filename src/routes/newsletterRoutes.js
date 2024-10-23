// routes/newsletterRoutes.js
const express = require('express');
const {
    subscribeToNewsletter,
    getAllSubscriptions,
    deleteSubscription
} = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth'); // Import your authentication middleware

const router = express.Router();

// Route for subscribing to the newsletter
router.route('/subscribe').post(subscribeToNewsletter);

// Admin can get all subscriptions
router.route('/').get(protect, admin, getAllSubscriptions);

// Admin can delete a subscription by ID
router.route('/:id').delete(protect, admin, deleteSubscription);

module.exports = router;
