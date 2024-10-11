// const Contact = require('../models/Contact');
// const nodemailer = require('nodemailer');

// // Set up Nodemailer transport
// const transporter = nodemailer.createTransport({
//     service: 'Gmail', // or another service like SendGrid, Mailgun, etc.
//     auth: {
//         user: process.env.EMAIL_USER, // your email address
//         pass: process.env.EMAIL_PASS, // your email password or app password
//     },
// });

// // Handle contact form submission
// const submitContactForm = async (req, res) => {
//     const { name, email, message } = req.body;

//     try {
//         const contact = new Contact({ name, email, message });
//         await contact.save();

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: 'rewaayasser@hotmail.com',
//             subject: 'Test Email',
//             text: 'Hello, this is a test email!',
//         };

//         await transporter.sendMail(mailOptions);
//         res.status(200).send('Message sent successfully');
//     } catch (err) {
//         res.status(500).send('Error: ' + err.message);
//     }
// };


// module.exports = {
//     submitContactForm,
// };

const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465, // SSL connection
//     secure: true, // True for SSL
//     auth: {
//         user: process.env.EMAIL_USER, // Your email address from .env
//         pass: process.env.EMAIL_PASS, // Your app password from .env
//     },
// });
// Set up Nodemailer transport with explicit SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587, // Use STARTTLS
    secure: false, // False for STARTTLS (not SSL)
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your app password from .env
    },
    
});

// Handle contact form submission
const submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save the contact form data to the database
        const contact = new Contact({ name, email, message });
        await contact.save();

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: 'waleedmaryam396@gmail.com', // Receiver's email address
            subject: `New Contact Message from ${name}`, // Correct usage of template literals
            text: `Message from: ${name}\nEmail: ${email}\nMessage: ${message}`, // Correct usage of template literals
        };

        // Send email using the transporter
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully');
    } catch (err) {
        console.error('Error sending email: ', err); // Log any errors
        res.status(500).send('Error: ' + err.message); // Send error response
    }
};

module.exports = {
    submitContactForm,
};
