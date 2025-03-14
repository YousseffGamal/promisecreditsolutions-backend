require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Ensure the path is correct
const userRoutes = require('./routes/userRoutes'); // Add user routes
const invoiceRoutes = require('./routes/invoiceRoutes'); // Add user routes
const contactRoutes = require('./routes/contactRoutes'); // Import the contact routes
const reviewsRoutes = require('./routes/reviewsRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes'); // Add this line
const creditScoresRoutes = require('./routes/creditScoresRoutes');

const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Replace with your frontend URL if deployed
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));
// Use your routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Use user routes here
app.use('/api', invoiceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', reviewsRoutes);
app.use('/api/newsletter', newsletterRoutes); // Use newsletter routes here
app.use('/api/credit-scores', creditScoresRoutes);

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI; // Use MONGODB_URI from .env
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

});
