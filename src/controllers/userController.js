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
        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user performing the action is an admin
        

        // Update the credit score
        user.creditScore = req.body.creditScore;

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ message: 'Credit score updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating credit score:', error);
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

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        console.log(`Attempting to delete user with ID: ${req.params.id}`);
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user by ID
        await User.findByIdAndDelete(req.params.id);

        console.log('User deleted successfully');
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error); // Log the full error details
        res.status(500).json({ message: 'Server error', error: error.message }); // Send the exact error message for debugging
    }
};
