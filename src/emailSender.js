const nodemailer = require('nodemailer');

// Create the email transporter with Gmail, Outlook, or any SMTP service
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // SSL connection
    secure: true, // True for SSL
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your app password from .env
    },
});

const sendEmail = async (to, subject, text, attachments = []) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to, // Receiver's email
      subject, // Email subject
      text, // Email body text
      attachments, // Optional attachments (like PDF invoice)
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
