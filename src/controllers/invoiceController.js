const Invoice = require('../models/Invoice'); // Adjust the path to your invoice model
const User = require('../models/User'); // Adjust the path to your user model

// CREATE: Add a new invoice
exports.createInvoice = async (req, res) => {
    try {
        const { name, date, message, price, dueDate, userId } = req.body;

        // Create a new invoice
        const newInvoice = new Invoice({
            name,
            date,
            message,
            price,
            dueDate,
            paymentStatus: 'pending'
        });

        // Save the invoice
        const savedInvoice = await newInvoice.save();

        // Find the user and add the invoice to their invoices array
        const user = await User.findById(userId);
        user.invoices.push(savedInvoice._id);
        await user.save();

        res.status(201).json({ message: 'Invoice created successfully', invoice: savedInvoice });
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error });
    }
};

// READ: Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json({ message: 'Invoices fetched successfully', invoices });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error });
    }
};

// READ: Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        res.status(200).json({ message: 'Invoice fetched successfully', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error });
    }
};

// UPDATE: Update an existing invoice
exports.updateInvoice = async (req, res) => {
    try {
        const { name, date, message, price, paymentStatus, dueDate } = req.body;

        // Find and update the invoice by ID
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { name, date, message, price, paymentStatus, dueDate },
            { new: true } // Return the updated document
        );

        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });

        res.status(200).json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice', error });
    }
};

// DELETE: Delete an invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        // Also remove the invoice reference from the user
        await User.updateMany({}, { $pull: { invoices: req.params.id } });

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoice', error });
    }
};
