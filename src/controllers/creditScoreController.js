const CreditScores = require('../models/CreditScores');
const User = require('../models/User');

// Add Credit Scores to User
exports.addCreditScores = async (req, res) => {
    const { userId } = req.params;
    const { transunion, experian, equifax } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user already has credit scores linked
        if (user.creditScores) {
            return res.status(400).json({ message: 'Credit scores already exist for this user.' });
        }

        // Create new credit scores
        const newCreditScores = await CreditScores.create({
            transunion,
            experian,
            equifax
        });

        // Link the new credit scores to the user
        user.creditScores = newCreditScores._id;
        await user.save();

        res.status(201).json({ message: 'Credit scores added successfully.', data: newCreditScores });
    } catch (error) {
        console.error('Error adding credit scores:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Append New Credit Scores Entry for User
exports.addNewCreditScoreEntry = async (req, res) => {
    const { userId } = req.params;
    const { transunion, experian, equifax } = req.body;

    try {
        // Find the user and populate their credit scores
        const user = await User.findById(userId).populate('creditScores');
        if (!user || !user.creditScores) {
            return res.status(404).json({ message: 'Credit scores not found for this user.' });
        }

        // Append new scores if provided, ensuring they are numbers
        const creditScores = user.creditScores;
        if (transunion !== undefined) creditScores.transunion.push(Number(transunion));
        if (experian !== undefined) creditScores.experian.push(Number(experian));
        if (equifax !== undefined) creditScores.equifax.push(Number(equifax));

        await creditScores.save();

        res.status(200).json({ message: 'New credit scores added successfully.', data: creditScores });
    } catch (error) {
        console.error('Error adding new credit scores entry:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


// Update Credit Scores for User
exports.updateCreditScores = async (req, res) => {
    const { userId } = req.params;
    const { transunion, experian, equifax } = req.body;

    try {
        // Find the user and populate their credit scores
        const user = await User.findById(userId).populate('creditScores');
        if (!user || !user.creditScores) {
            return res.status(404).json({ message: 'Credit scores not found for this user.' });
        }

        // Update the scores
        const creditScores = user.creditScores;
        creditScores.transunion = transunion || creditScores.transunion;
        creditScores.experian = experian || creditScores.experian;
        creditScores.equifax = equifax || creditScores.equifax;

        await creditScores.save();

        res.status(200).json({ message: 'Credit scores updated successfully.', data: creditScores });
    } catch (error) {
        console.error('Error updating credit scores:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get Credit Scores for User
exports.getCreditScores = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user and populate their credit scores
        const user = await User.findById(userId).populate('creditScores');

        if (!user || !user.creditScores) {
            return res.status(404).json({ message: 'No credit scores found for this user.' });
        }

        res.status(200).json({ data: user.creditScores });
    } catch (error) {
        console.error('Error fetching credit scores:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
