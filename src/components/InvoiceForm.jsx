import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
  const [formState, setFormState] = useState({
    name: '', // Added name field
    invoiceNumber: '',
    billToCompany: '',
    date: '',
    status: 'Unpaid', // Default value
    items: [],
    address: '',
    phone: '',
    email: '',
    taxRate: 0, // Tax Rate input
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleAddItem = () => {
    const newItem = { description: '', amount: '', taxed: false };
    setFormState({
      ...formState,
      items: [...formState.items, newItem],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formState.items];
    updatedItems[index][field] = value;
    setFormState({ ...formState, items: updatedItems });
  };

  const handleSave = () => {
    const newInvoice = { ...formState, id: Date.now() };
    const existingInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    localStorage.setItem('invoices', JSON.stringify([...existingInvoices, newInvoice]));
    localStorage.setItem('showInvoiceList', 'true');
    navigate('/'); // Redirect to the invoice list after saving
  };

  // Back button functionality
  const handleBack = () => {
    navigate(-1); // This will navigate the user to the previous page
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>Create Invoice</h2>
      <button onClick={handleBack} style={styles.backBtn}>
        ⬅ Back
      </button>

      {/* Name input */}
      <input
        type="text"
        name="name"
        value={formState.name}
        onChange={handleChange}
        placeholder="Your Name"
        style={styles.inputField}
      />

      <input
        type="text"
        name="invoiceNumber"
        value={formState.invoiceNumber}
        onChange={handleChange}
        placeholder="Invoice Number"
        style={styles.inputField}
      />
      <input
        type="text"
        name="billToCompany"
        value={formState.billToCompany}
        onChange={handleChange}
        placeholder="Client Company"
        style={styles.inputField}
      />
      <input
        type="date"
        name="date"
        value={formState.date}
        onChange={handleChange}
        style={styles.inputField}
      />
      <select
        name="status"
        value={formState.status}
        onChange={handleChange}
        style={styles.inputField}
      >
        <option value="Unpaid">Unpaid</option>
        <option value="Paid">Paid</option>
      </select>
      <input
        type="text"
        name="address"
        value={formState.address}
        onChange={handleChange}
        placeholder="Billing Address"
        style={styles.inputField}
      />
      <input
        type="text"
        name="phone"
        value={formState.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        style={styles.inputField}
      />
      <input
        type="email"
        name="email"
        value={formState.email}
        onChange={handleChange}
        placeholder="Email"
        style={styles.inputField}
      />

      {/* Tax Rate */}
      <input
        type="number"
        name="taxRate"
        value={formState.taxRate}
        onChange={handleChange}
        placeholder="Tax Rate (%)"
        style={styles.inputField}
      />

      <div>
        <h3 style={styles.itemsHeading}>Items</h3>
        {formState.items.map((item, index) => (
          <div key={index} style={styles.itemContainer}>
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              placeholder="Item Description"
              style={styles.inputField}
            />
            <input
              type="number"
              value={item.amount}
              onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              style={styles.inputField}
            />
            <div style={styles.taxedContainer}>
              <input
                type="checkbox"
                checked={item.taxed}
                onChange={(e) => handleItemChange(index, 'taxed', e.target.checked)}
                style={styles.checkbox}
              />
              <label style={styles.checkboxLabel}>Taxed</label>
            </div>
          </div>
        ))}
        <button onClick={handleAddItem} style={styles.addItemBtn}>
          Add Item
        </button>
      </div>

      <button onClick={handleSave} style={styles.saveBtn}>
        Save Invoice
      </button>
    </div>
  );
};

const styles = {
  formContainer: {
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
  },
  inputField: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  addItemBtn: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '16px',
    marginTop: '12px',
  },
  saveBtn: {
    marginTop: '20px',
    padding: '14px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '16px',
  },
  itemsHeading: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
  },
  taxedContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
  },
  checkboxLabel: {
    fontSize: '16px',
    color: '#333',
  },
  backBtn: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '16px',
  },
};

export default InvoiceForm;
