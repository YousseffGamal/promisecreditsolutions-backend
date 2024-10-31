const express = require('express');
const {
    addCreditScores,
    updateCreditScores,
    getCreditScores,
    addNewCreditScoreEntry
} = require('../controllers/creditScoreController');

const router = express.Router();

// Route to add credit scores to a user
router.post('/add/:userId', addCreditScores);

// Route to update credit scores for a user
router.put('/update/:userId', updateCreditScores);

// Route to append new credit scores
router.post('/append/:userId', addNewCreditScoreEntry);

// Route to get credit scores for a user by user ID
router.get('/:userId', getCreditScores);

module.exports = router;