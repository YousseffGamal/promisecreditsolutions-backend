const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Go up two levels to reach the uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Save file with timestamp
    },
});

// Initialize upload variable
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('profileImage'), (req, res) => {
    res.json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
