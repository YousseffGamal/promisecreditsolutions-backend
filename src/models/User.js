// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const Invoice = require('./Invoice');

// const userSchema = new mongoose.Schema({
//     fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, default: 'user', enum: ['user', 'admin'] },
//     profileImage: { type: String },
//     invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }],  // Array of ObjectId referencing Invoice model
//     creditScore: { type: [Number], default: [] }
// });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.getPaymentStatuses = async function () {
//     const user = this;
//     await user.populate('invoices'); // Populate the invoices from the Invoice model
//     return user.invoices.map(invoice => ({
//         name: invoice.name,
//         paymentStatus: invoice.paymentStatus,
//         price: invoice.price
//     }));
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'] 
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    profileImage: { type: String },
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }],
    creditScores: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditScores' }  // Link to CreditScores model
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Handle unique constraint error
userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Email already exists. Please use a different email.'));
    } else {
        next(error);
    }
});

// Password matching method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get payment statuses from invoices
userSchema.methods.getPaymentStatuses = async function () {
    const user = await this.populate('invoices').execPopulate();
    return user.invoices.map(({ name, paymentStatus, price }) => ({
        name, paymentStatus, price
    }));
};

// Create index for email
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
