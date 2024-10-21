const Reviews = require('../models/reviews'); // Adjust path if necessary
const multer = require('multer');
const path = require('path');
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

const upload = multer({ storage: storage });
// CREATE: Add a new review
exports.createReview = async (req, res) => {
    try {
        const { name, date, message } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Get image path if uploaded

        const newReview = new Reviews({
            name,
            date,
            message,
            imageUrl, // Save image URL
        });

        const savedReview = await newReview.save();
        res.status(201).json({ message: 'Review created successfully', review: savedReview });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// READ: Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Reviews.find();
        res.status(200).json({ message: 'Reviews fetched successfully', reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// READ: Get a single review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Reviews.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review fetched successfully', review });
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE: Update a review by ID
exports.updateReview = async (req, res) => {
    try {
        const { name, date, message } = req.body;

        const updatedReview = await Reviews.findByIdAndUpdate(
            req.params.id,
            { name, date, message },
            { new: true } // Return the updated review
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE: Delete a review by ID
exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Reviews.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
