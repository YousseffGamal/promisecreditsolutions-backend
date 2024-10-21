const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const multer = require('multer');





// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the uploads directory
    },
    filename: (req, file, cb) => {
        // Save file with a timestamp and original name
        cb(null, `${Date.now()}-${file.originalname}`); 
    },
});
// Use the same `upload` configuration for handling image uploads
const upload = multer({ storage: storage }); // Use the storage configuration

// Route to create a new review (with image upload)
router.post('/reviews', upload.single('image'), reviewsController.createReview);

// Route to get all reviews
router.get('/reviews', reviewsController.getAllReviews);

// Route to get a single review by ID
router.get('/reviews/:id', reviewsController.getReviewById);

// Route to update a review by ID
router.put('/reviews/:id', reviewsController.updateReview);

// Route to delete a review by ID
router.delete('/reviews/:id', reviewsController.deleteReview);

module.exports = router;
