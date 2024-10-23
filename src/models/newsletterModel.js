// models/newsletterModel.js
const mongoose = require('mongoose');

// Define the Newsletter schema
const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate emails
        match: /.+\@.+\..+/ // Basic email validation regex
    },
    subscribedAt: {
        type: Date,
        default: Date.now // Automatically set to current date
    }
});

// Create the model
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
