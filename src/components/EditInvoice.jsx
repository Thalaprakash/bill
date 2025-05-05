import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditInvoice = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const selectedInvoice = savedInvoices.find((inv) => inv.id === invoiceId);
    if (selectedInvoice) {
      setInvoice(selectedInvoice);
    } else {
      alert("Invoice not found!");
      navigate("/"); // Redirect if invoice is not found
    }
  }, [invoiceId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const updatedInvoices = savedInvoices.map((inv) =>
      inv.id === invoice.id ? { ...invoice } : inv
    );
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    navigate("/"); // Redirect back to the invoice list page
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Edit Invoice</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={styles.formGroup}>
          <label>Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={invoice.invoiceNumber}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={invoice.date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Client</label>
          <input
            type="text"
            name="billToCompany"
            value={invoice.billToCompany}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        {/* Add more fields as needed */}
        <div style={styles.formGroup}>
          <button type="button" onClick={handleSave} style={styles.saveButton}>
            Save
          </button>
        </div>
      </form>
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
  formGroup: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  saveButton: {
    padding: "10px 15px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default EditInvoice;
