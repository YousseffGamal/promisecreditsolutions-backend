const Invoice = require('../models/Invoice'); // Adjust the path to your invoice model
const User = require('../models/User'); // Adjust the path to your user model
const sendEmail = require('../emailSender'); // Import the sendEmail function
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


// // CREATE: Add a new invoice
// // exports.createInvoice = async (req, res) => {
// //     try {
// //         const { name, date, message, price, dueDate, userId } = req.body;

// //         // Create a new invoice
// //         const newInvoice = new Invoice({
// //             name,
// //             date,
// //             message,
// //             price,
// //             dueDate,
// //             paymentStatus: 'pending'
// //         });

// //         // Save the invoice
// //         const savedInvoice = await newInvoice.save();

// //         // Find the user and add the invoice to their invoices array
// //         const user = await User.findById(userId);
// //         user.invoices.push(savedInvoice._id);
// //         await user.save();

// //         res.status(201).json({ message: 'Invoice created successfully', invoice: savedInvoice });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error creating invoice', error });
// //     }
// // };


// exports.createInvoice = async (req, res) => {
//     try {
//       const { name, date, message, price, dueDate, userId } = req.body;
  

//       const generateInvoicePDF = (invoice) => {
//         const doc = new PDFDocument();
//         const fileName = `Invoice_${invoice._id}.pdf`;
      
//         doc.pipe(fs.createWriteStream(`./invoices/${fileName}`));
      
//         doc.text(`Invoice: ${invoice.name}`);
//         doc.text(`Date: ${invoice.date}`);
//         doc.text(`Due Date: ${invoice.dueDate}`);
//         doc.text(`Message: ${invoice.message}`);
//         doc.text(`Total Amount: $${invoice.price}`);
//         doc.text(`Payment Status: ${invoice.paymentStatus}`);
      
//         doc.end();
        
//         return `./invoices/${fileName}`;
//       };
      
//       // Inside createInvoice function
//       const pdfPath = generateInvoicePDF(savedInvoice);
      
//       const emailAttachments = [
//         {
//           filename: `Invoice_${savedInvoice._id}.pdf`,
//           path: pdfPath,
//         },
//       ];


//       // Create a new invoice
//       const newInvoice = new Invoice({
//         name,
//         date,
//         message,
//         price,
//         dueDate,
//         paymentStatus: 'pending'
//       });
  
//       // Save the invoice
//       const savedInvoice = await newInvoice.save();
  
//       // Find the user and add the invoice to their invoices array
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       user.invoices.push(savedInvoice._id);
//       await user.save();
  
//       // Send the invoice email to the user
//       const emailSubject = `Invoice for ${name} - Amount: $${price}`;
//       const emailBody = `
//         Hello ${user.fullName},
        
//         Please find your invoice details below:
        
//         Invoice: ${name}
//         Date: ${date}
//         Due Date: ${dueDate}
//         Message: ${message}
//         Total Amount: $${price}
//         Payment Status: Pending
        
//         Thank you!
//       `;
  
//       console.log("user email:", user.email);
//       // Sending email to the user
//       await sendEmail(user.email, emailSubject, emailBody, emailAttachments);
  
//       res.status(201).json({ message: 'Invoice created and email sent successfully', invoice: savedInvoice });
//     } catch (error) {
    
//       res.status(500).json({ message: 'Error creating invoice', error });
//     }
//   };



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


// exports.createInvoice = async (req, res) => {

//   try {
//     const { name, date, message, price, dueDate, userId } = req.body;

//     // Create a new invoice
//     const newInvoice = new Invoice({
//       name,
//       date,
//       message,
//       price,
//       dueDate,
//       paymentStatus: 'pending'
//     });

//     // Save the invoice to the database
//     const savedInvoice = await newInvoice.save();

//     // Find the user and add the invoice to their invoices array
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     user.invoices.push(savedInvoice._id);
//     await user.save();

//     // Function to generate PDF invoice
//     const generateInvoicePDF = (invoice) => {
//       const doc = new PDFDocument();
//       const invoicesDir = path.join(__dirname, '../../invoices'); // Path to store invoices
      
//       // Create the directory if it doesn't exist
//       if (!fs.existsSync(invoicesDir)) {
//         fs.mkdirSync(invoicesDir);
//       }
      
//       const fileName = `Invoice_${invoice._id}.pdf`;
//       const filePath = path.join(invoicesDir, fileName);

//       // Pipe PDF data to the file
//       doc.pipe(fs.createWriteStream(filePath));

//       // Add invoice details to the PDF
//       doc.text(`Invoice: ${invoice.name}`);
//       doc.text(`Date: ${invoice.date}`);
//       doc.text(`Due Date: ${invoice.dueDate}`);
//       doc.text(`Message: ${invoice.message}`);
//       doc.text(`Total Amount: $${invoice.price}`);
//       doc.text(`Payment Status: ${invoice.paymentStatus}`);

//       doc.end(); // Finish the PDF

//       return filePath;
//     };

//     // Generate the invoice PDF
//     const pdfPath = generateInvoicePDF(savedInvoice);

//     // Prepare email attachments (the PDF invoice)
//     const emailAttachments = [
//       {
//         filename: `Invoice_${savedInvoice._id}.pdf`,
//         path: pdfPath,
//       },
//     ];

//     // Prepare email content
//     const emailSubject = `Invoice for ${name} - Amount: $${price}`;
//     const emailBody = `
//       Hello ${user.fullName},

//       Please find your invoice details below:

//       Invoice: ${name}
//       Date: ${date}
//       Due Date: ${dueDate}
//       Message: ${message}
//       Total Amount: $${price}
//       Payment Status: Pending

//       Thank you!
//     `;

//     // Sending the email with PDF attachment
//     await sendEmail(user.email, emailSubject, emailBody, emailAttachments);

//     res.status(201).json({ message: 'Invoice created and email sent successfully', invoice: savedInvoice });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating invoice', error });
//   }
// };




// exports.createInvoice = async (req, res) => {
//     try {
//       const { name, date, message, price, dueDate, userId } = req.body;
  
//       // Create a new invoice
//       const newInvoice = new Invoice({
//         name,
//         date,
//         message,
//         price,
//         dueDate,
//         paymentStatus: 'pending',
//       });
  
//       // Save the invoice to the database
//       const savedInvoice = await newInvoice.save();
  
//       // Find the user and add the invoice to their invoices array
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       user.invoices.push(savedInvoice._id);
//       await user.save();
  
//       // Function to generate PDF invoice
//       const generateInvoicePDF = (invoice) => {
//         const doc = new PDFDocument();
//         const invoicesDir = path.join(__dirname, '../../invoices'); // Path to store invoices
  
//         // Create the directory if it doesn't exist
//         if (!fs.existsSync(invoicesDir)) {
//           fs.mkdirSync(invoicesDir);
//         }
  
//         const fileName = `Invoice_${invoice._id}.pdf`;
//         const filePath = path.join(invoicesDir, fileName);
  
//         // Pipe PDF data to the file
//         doc.pipe(fs.createWriteStream(filePath));
  
//         // Add invoice details to the PDF
//         doc.text(`Invoice: ${invoice.name}`);
//         doc.text(`Date: ${invoice.date}`);
//         doc.text(`Due Date: ${invoice.dueDate}`);
//         doc.text(`Message: ${invoice.message}`);
//         doc.text(`Total Amount: $${invoice.price}`);
//         doc.text(`Payment Status: ${invoice.paymentStatus}`);
  
//         doc.end(); // Finish the PDF
  
//         return filePath;
//       };
  
//       // Generate the invoice PDF
//       const pdfPath = generateInvoicePDF(savedInvoice);
  
//       // Prepare email attachments (the PDF invoice)
//       const emailAttachments = [
//         {
//           filename: `Invoice_${savedInvoice._id}.pdf`,
//           path: pdfPath,
//         },
//       ];
  
//       // Prepare email content
//       const emailSubject = `Invoice for ${name} - Amount: $${price}`;
//       const emailBody = `
//         Hello ${user.fullName},
  
//         Please find your invoice details below:
  
//         Invoice: ${name}
//         Date: ${date}
//         Due Date: ${dueDate}
//         Message: ${message}
//         Total Amount: $${price}
//         Payment Status: Pending
  
//         Thank you!
//       `;
  
//       // Sending the email with PDF attachment
//       await sendEmail(user.email, emailSubject, emailBody, emailAttachments);
  
//       res.status(201).json({ message: 'Invoice created and email sent successfully', invoice: savedInvoice });
//     } catch (error) {
//       // Log the error for debugging purposes
//       console.error('Error creating invoice:', error);
  
//       // Send a more detailed error message for easier debugging
//       res.status(500).json({ message: 'Error creating invoice', error: error.message || error });
//     }
//   };

// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// Improved PDF generation function

const generateInvoicePDF = (invoice) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const invoicesDir = path.join(__dirname, '../../invoices'); // Directory for PDFs

    // Create the directory if it doesn't exist
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir);
    }

    const fileName = `Invoice_${invoice._id}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    // Pipe PDF data to the file
    doc.pipe(fs.createWriteStream(filePath));

    // Header Section
    doc.fontSize(20).text('Future Club Invoice', { align: 'center' });
    doc.moveDown();

    // Invoice Info
    doc.fontSize(10)
        .text(`Invoice ID: ${invoice._id}`, { align: 'left' })
        .text(`Date: ${invoice.date}`, { align: 'left' })
        .text(`Due Date: ${invoice.dueDate}`, { align: 'left' });

    doc.moveDown(2);

    // Customer Info
    doc.fontSize(12)
        .text(`Billed To: ${invoice.name}`, { align: 'left' })
        .text(`Status: ${invoice.paymentStatus}`, { align: 'left' });

    doc.moveDown();

    // Invoice Table Header
    doc.fontSize(12).text('Invoice Details', { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;

    // Table Header
    doc.fontSize(10)
        .text('Description', 50, tableTop + 5)
        .text('Amount', 400, tableTop + 5);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Invoice Item
    doc.text(`${invoice.message}`, 50, doc.y + 5)
        .text(`$${invoice.price}`, 400, doc.y);

    doc.moveDown(2);

    // Total Amount
    doc.fontSize(12).text(`Total: $${invoice.price}`, { align: 'right' });

    doc.moveDown(2);

    // Footer Section
    doc.fontSize(10)
        .text('Thank you for your business!', { align: 'center' })
        .text('For questions, please contact us at support@futureclub.com.', {
            align: 'center',
        });

    doc.end(); // Finalize the PDF

    return filePath;
};

    // Updated createInvoice function
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
                paymentStatus: 'pending',
            });

            // Save the invoice to the database
            const savedInvoice = await newInvoice.save();

            // Find the user and add the invoice to their invoices array
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.invoices.push(savedInvoice._id);
            await user.save();

            // Generate the invoice PDF
            const pdfPath = generateInvoicePDF(savedInvoice);

            // Prepare email attachments (the PDF invoice)
            const emailAttachments = [
                {
                    filename: `Invoice_${savedInvoice._id}.pdf`,
                    path: pdfPath,
                },
            ];

            // Prepare email content
            const emailSubject = `Invoice for ${name} - Amount: $${price}`;
            const emailBody = `
                Hello ${user.fullName},

                Please find your invoice details below:

                Invoice: ${name}
                Date: ${date}
                Due Date: ${dueDate}
                Message: ${message}
                Total Amount: $${price}
                Payment Status: Pending

                Thank you!
            `;

            // Sending the email with PDF attachment
            await sendEmail(user.email, emailSubject, emailBody, emailAttachments);

            res.status(201).json({
                message: 'Invoice created and email sent successfully',
                invoice: savedInvoice,
            });
        } catch (error) {
            console.error('Error creating invoice:', error);
            res.status(500).json({
                message: 'Error creating invoice',
                error: error.message || error,
            });
        }
    };

  
// In invoiceController.js
exports.countInvoices = async (req, res) => {
  console.log('Hit the countInvoices route');
  try {
      const invoiceCount = await Invoice.countDocuments();
      res.status(200).json({ message: 'Invoice count fetched successfully', count: invoiceCount });
  } catch (error) {
      console.error('Error fetching invoice count:', error);
      res.status(500).json({ message: 'Error fetching invoice count', error });
  }
};


exports.countPaidInvoices = async (req, res) => {
    try {
        // Count only those invoices where paymentStatus is 'paid'
        const count = await Invoice.countDocuments({ paymentStatus: 'paid' });
        res.status(200).json({ message: 'Count of paid invoices fetched successfully', count });
    } catch (error) {
        console.error('Error fetching count of paid invoices:', error);
        res.status(500).json({ message: 'Error fetching count of paid invoices', error });
    }
};