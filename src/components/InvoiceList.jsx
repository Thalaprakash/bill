import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage, setInvoicesPerPage] = useState(10);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(savedInvoices);
    setFilteredInvoices(savedInvoices);
    setCompanyLogo(localStorage.getItem("companyLogo"));
    setSignatureImage(localStorage.getItem("signatureImage"));
  }, []);

  useEffect(() => {
    const filtered = invoices.filter((invoice) =>
      invoice.invoiceNumber.includes(searchQuery) ||
      invoice.billToCompany.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchQuery, invoices]);

  const handleEdit = (invoiceId) => {
    const invoiceToEdit = invoices.find((invoice) => invoice.id === invoiceId);
    if (invoiceToEdit && invoiceToEdit.userId === currentUser?.id) {
      navigate(`/edit-invoice/${invoiceId}`);
    } else {
      alert("You are not authorized to edit this invoice.");
    }
  };

  const handleDelete = (invoiceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
    if (!confirmDelete) return;
    const updatedInvoices = invoices.filter((inv) => inv.id !== invoiceId);
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  const calculateSubtotal = (invoice) =>
    invoice.items?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0;

  const calculateTax = (invoice, taxRate) => {
    const taxable = invoice.items?.reduce((sum, item) =>
      item.taxed ? sum + parseFloat(item.amount || 0) : sum, 0);
    return (taxable * taxRate) / 100;
  };

  const handleDownloadPDF = (invoice) => {
    const doc = new jsPDF();
    const companyName = localStorage.getItem("companyName") || "Your Company Name";
    const companyAddress = localStorage.getItem("companyAddress") || "Your Company Address";
    const companyPhone = localStorage.getItem("companyPhone") || "Your Company Phone";
    const bankName = localStorage.getItem("bankName") || "Bank Name";
    const accountNumber = localStorage.getItem("accountNumber") || "Account Number";
    const ifscCode = localStorage.getItem("ifscCode") || "IFSC Code";
    const upiId = localStorage.getItem("upiId") || "UPI ID";
    const billToName = invoice.billToName || "Client Name";
    const billToAddress = invoice.billToAddress || "Client Address";
    const billToCompany = invoice.billToCompany || "Client Company";

    if (companyLogo) {
      const imgProps = doc.getImageProperties(companyLogo);
      const imgHeight = (40 / imgProps.width) * imgProps.height;
      doc.addImage(companyLogo, 'PNG', 150, 10, 40, imgHeight);
    }

    doc.setFontSize(14);
    doc.text(companyName, 14, 20);
    doc.setFontSize(12);
    doc.text(companyAddress, 14, 30);
    doc.text(companyPhone, 14, 40);
    doc.setFontSize(18);
    doc.text(`Invoice #${invoice.invoiceNumber}`, 14, 50);
    doc.setFontSize(12);
    doc.text(`Date: ${invoice.date}`, 14, 58);
    doc.text("Bill To:", 14, 66);
    doc.text(billToName, 14, 74);
    doc.text(billToCompany, 14, 82);
    doc.text(billToAddress, 14, 90);

    const tableData = invoice.items?.map((item, index) => [
      index + 1,
      item.description,
      `₹ ${parseFloat(item.amount || 0).toFixed(2)}`,
      item.taxed ? "Yes" : "No",
    ]) || [];

    autoTable(doc, {
      head: [["#", "Item Description", "Amount", "Taxed"]],
      body: tableData,
      startY: 100,
      theme: "striped",
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: [44, 62, 80],
        halign: 'left',
        fontSize: 11,
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 100 },
        2: { halign: 'right', cellWidth: 30 },
        3: { halign: 'center', cellWidth: 20 },
      },
    });

    const subtotal = calculateSubtotal(invoice);
    const taxRate = parseFloat(invoice.taxRate || 0);
    const totalTax = calculateTax(invoice, taxRate);
    const total = subtotal + totalTax;
    const afterTableY = doc.lastAutoTable.finalY + 10;

    doc.text(`Subtotal: ₹ ${subtotal.toFixed(2)}`, 14, afterTableY);
    doc.text(`Tax (${taxRate}%): ₹ ${totalTax.toFixed(2)}`, 14, afterTableY + 8);
    doc.text(`Total: ₹ ${total.toFixed(2)}`, 14, afterTableY + 16);

    const bankDetailsY = afterTableY + 30;
    doc.setFontSize(12);
    doc.text("Bank Details:", 14, bankDetailsY);
    doc.text(`Bank: ${bankName}`, 14, bankDetailsY + 8);
    doc.text(`Account No: ${accountNumber}`, 14, bankDetailsY + 16);
    doc.text(`IFSC: ${ifscCode}`, 14, bankDetailsY + 24);
    doc.text(`UPI ID: ${upiId}`, 14, bankDetailsY + 32);

    if (signatureImage) {
      const sigProps = doc.getImageProperties(signatureImage);
      const sigHeight = (30 / sigProps.width) * sigProps.height;
      doc.addImage(signatureImage, 'PNG', 150, bankDetailsY, 30, sigHeight);
    }

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleBack = () => navigate(-1);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Invoices</h2>

      <div style={styles.headerActions}>
        <button onClick={handleBack} style={styles.backBtn}>⬅ Back</button>
        <button
          style={styles.createInvoiceButton}
          onClick={() => navigate("/create-invoice")}
        >
          ➕ Create New Invoice
        </button>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search by invoice number or client name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={styles.rowsPerPageContainer}>
        <label>Show: </label>
        <select
          value={invoicesPerPage}
          onChange={(e) => {
            setInvoicesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Invoice #</th>
            <th style={styles.th}>Client</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.map((inv) => (
            <tr key={inv.id} style={styles.row}>
              <td style={styles.td}>{inv.date}</td>
              <td style={styles.td}>{inv.invoiceNumber}</td>
              <td style={styles.td}>{inv.billToCompany}</td>
              <td style={styles.td}>₹ {calculateSubtotal(inv).toFixed(2)}</td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleDownloadPDF(inv)}>⬇️</button>
                <button style={styles.editButton} onClick={() => handleEdit(inv.id)}>✏️</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(inv.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
        <button
          style={styles.pageButton}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          style={styles.pageButton}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * invoicesPerPage >= filteredInvoices.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f9fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#34495e",
  },
  headerActions: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  backBtn: {
    backgroundColor: "#bdc3c7",
    color: "#2c3e50",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  searchContainer: {
    marginBottom: "15px",
  },
  rowsPerPageContainer: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  select: {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  searchInput: {
    padding: "10px",
    width: "100%",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  th: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "10px 15px",
    textAlign: "center",
  },
  td: {
    padding: "12px 15px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
  },
  row: {
    backgroundColor: "#f2f2f2",
  },
  button: {
    backgroundColor: "#27ae60",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
  editButton: {
    backgroundColor: "#f39c12",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  pageButton: {
    padding: "8px 15px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  createInvoiceButton: {
    padding: "12px 20px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default InvoiceList;
