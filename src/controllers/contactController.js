const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another service like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
    },
});

// Handle contact form submission
const submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const contact = new Contact({ name, email, message });
        await contact.save();

        // Send email to a static email address
        const mailOptions = {
            from: process.env.EMAIL_USER, // or another static email address
            to: 'youssefggamal552@gmail.com', // Static email address
            subject: `New Contact Message from ${name}`,
            text: `Message from: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email: ' + error.message);
            }
            res.status(200).send('Message sent: ' + info.response);
        });
    } catch (err) {
        res.status(500).send('Error saving contact: ' + err.message);
    }
};

module.exports = {
    submitContactForm,
};
