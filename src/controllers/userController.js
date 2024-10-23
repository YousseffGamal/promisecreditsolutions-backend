const User = require('../models/User');


// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        

        const users = await User.find().populate('invoices');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    console.log(`Fetching user with ID: ${req.params.id}`); // Log the user ID being fetched
    try {
        const user = await User.findById(req.params.id).populate('invoices');
        if (user) { 
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error); // Log any errors
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.remove();
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user info
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            // Save updated user
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Get all invoices for a user by user ID
exports.getAllInvoicesForUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('invoices');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return all invoices associated with the user
        res.json(user.invoices);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single invoice for a user by invoice ID
exports.getInvoiceForUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('invoices');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the invoice within the user's invoices array
        const invoice = user.invoices.find(inv => inv._id.toString() === req.params.invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Update user's credit score (admin only)
exports.updateCreditScore = async (req, res) => {
    try {
        const { score } = req.body; // Get the new score from the request body

        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the score is a valid number
        if (typeof score !== 'number') {
            return res.status(400).json({ message: 'Credit score must be a number' });
        }

        // If creditScore is not an array, initialize it
        if (!Array.isArray(user.creditScore)) {
            user.creditScore = user.creditScore ? [user.creditScore] : [];
        }

        // Add the new score to the creditScore array
        user.creditScore.push(score);

        // Save the updated user
        const updatedUser = await user.save();

        // Get the first and latest scores from the array
        const firstScore = updatedUser.creditScore[0]; // First score entered
        const latestScore = updatedUser.creditScore[updatedUser.creditScore.length - 1]; // Latest score added

        // Calculate the difference between the first and latest scores
        const scoreDifference = latestScore - firstScore;

        res.status(200).json({
            message: 'Credit score updated successfully',
            user: updatedUser,
            difference: scoreDifference,
            firstScore,
            latestScore
        });
    } catch (error) {
        console.error('Error updating credit score:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Add a new credit score to a user (admin only)
exports.addCreditScore = async (req, res) => {
    try {
        
        const { score } = req.body; // Get the new credit score from the request body

        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the score is a valid number
        if (typeof score !== 'number') {
            return res.status(400).json({ message: 'Credit score must be a number' });
        }

        // Add the new credit score to the array
        user.creditScore.push(score);

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({
            message: 'Credit score added successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error adding credit score:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.getUserCount = async (req, res) => {
    console.log('Getting user count...');
    try {
        const count = await User.countDocuments();
        console.log(`User count: ${count}`);
        res.json({ count });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's credit score by ID
exports.getCreditScoreById = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the credit score
        res.json({ creditScore: user.creditScore });
    } catch (error) {
        console.error('Error fetching credit score:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
