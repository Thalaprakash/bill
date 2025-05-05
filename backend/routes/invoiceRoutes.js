const express = require("express");
const router = express.Router();
const { createInvoice, getInvoices } = require("../controllers/invoiceController");

// POST /api/invoices - create new invoice
router.post("/", createInvoice);

// GET /api/invoices - get all invoices
router.get("/", getInvoices);

module.exports = router;
