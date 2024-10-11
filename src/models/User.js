const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Invoice = require('./Invoice');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    profileImage: { type: String },

    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }]  // Array of ObjectId referencing Invoice model
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getPaymentStatuses = async function () {
    const user = this;
    await user.populate('invoices'); // Populate the invoices from the Invoice model
    return user.invoices.map(invoice => ({
        name: invoice.name,
        paymentStatus: invoice.paymentStatus,
        price: invoice.price
    }));
};

const User = mongoose.model('User', userSchema);

module.exports = User;
