const express = require('express');
const multer = require('multer');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Save file with a timestamp
    },
});

// Initialize upload variable
const upload = multer({ storage });

// Route for user registration with image upload
router.post('/register', upload.single('profileImage'), registerUser);

// Route for user login
router.post('/login', loginUser);

module.exports = router;
