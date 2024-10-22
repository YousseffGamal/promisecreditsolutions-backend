const Newsletter = require('../models/newsletterModel');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure to load environment variables

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Subscribe to the newsletter
exports.subscribeToNewsletter = async (req, res) => {
    const { email } = req.body;

    try {
        const newSubscription = new Newsletter({ email });
        await newSubscription.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Newsletter Subscription Confirmation',
            text: 'Thank you for subscribing to our newsletter!',
            html: '<h1>Welcome!</h1><p>Thank you for subscribing to our newsletter!</p>', // HTML body
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(400).json({ error: 'Subscription failed. Email may already be registered.' });
    }
};

// Get all newsletter subscriptions (admin only)
exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Newsletter.find();
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a subscription (admin only)
exports.deleteSubscription = async (req, res) => {
    try {
        const subscription = await Newsletter.findById(req.params.id);
        if (subscription) {
            await subscription.remove();
            res.json({ message: 'Subscription deleted' });
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
