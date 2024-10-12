// const Contact = require('../models/Contact');
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465, // SSL connection
//     secure: true, // True for SSL
//     auth: {
//         user: process.env.EMAIL_USER, // Your email address from .env
//         pass: process.env.EMAIL_PASS, // Your app password from .env
//     },
// });
// // Set up Nodemailer transport with explicit SMTP settings
// // const transporter = nodemailer.createTransport({
// //     host: 'smtp-mail.outlook.com',
// //     port: 587,
// //     secure: false, 
// //     auth: {
// //         user: process.env.EMAIL_USER, 
// //         pass: process.env.EMAIL_PASS, 
// //     },
    
// // });

// // Handle contact form submission
// const submitContactForm = async (req, res) => {
//     const { name, email, message } = req.body;

//     try {
//         // Save the contact form data to the database
//         const contact = new Contact({ name, email, message });
//         await contact.save();

//         // Email options
//         const mailOptions = {
//             from: process.env.EMAIL_USER, // Sender address
//             to: 'edenhazardd552@gmail.com', // Receiver's email address
//             subject: `New Contact Message from ${name}`, // Correct usage of template literals
//             text: `Message from: ${name}\nEmail: ${email}\nMessage: ${message}`, // Correct usage of template literals
//         };

//         // Send email using the transporter
//         await transporter.sendMail(mailOptions);
//         res.status(200).send('Message sent successfully');
//     } catch (err) {
//         console.error('Error sending email: ', err); // Log any errors
//         res.status(500).send('Error: ' + err.message); // Send error response
//     }
// };

// module.exports = {
//     submitContactForm,
// };


const Contact = require('../models/Contact');
const sendEmail = require('../emailSender'); // Import the sendEmail function

// Handle contact form submission
const submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save the contact form data to the database
        const contact = new Contact({ name, email, message });
        await contact.save();

        // Email subject and content
        const emailSubject = `New Contact Message from ${name}`;
        const emailBody = `Message from: ${name}\nEmail: ${email}\nMessage: ${message}`;

        // Use sendEmail utility to send the email
        await sendEmail('youssefggamal552@gmail.com', emailSubject, emailBody);

        res.status(200).send('Message sent successfully');
    } catch (err) {
        console.error('Error sending email: ', err); // Log any errors
        res.status(500).send('Error: ' + err.message); // Send error response
    }
};

module.exports = {
    submitContactForm,
};
