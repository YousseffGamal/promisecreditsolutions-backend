const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController'); // Adjust path if necessary

// Route to create a new review
router.post('/reviews', reviewsController.createReview);

// Route to get all reviews
router.get('/reviews', reviewsController.getAllReviews);

// Route to get a single review by ID
router.get('/reviews/:id', reviewsController.getReviewById);

// Route to update a review by ID
router.put('/reviews/:id', reviewsController.updateReview);

// Route to delete a review by ID
router.delete('/reviews/:id', reviewsController.deleteReview);

module.exports = router;
