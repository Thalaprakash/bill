const Invoice = require("../models/Invoice");

// Create new invoice
exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

// Get all invoices
exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};
