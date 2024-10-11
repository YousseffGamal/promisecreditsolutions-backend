const mongoose = require('mongoose');


const invoiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true},
    message: { type: String, required: true },
    price: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    dueDate: { type: Date, required: true },
});



const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
