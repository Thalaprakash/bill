import React, { useState } from 'react';
import InvoiceList from '../components/InvoiceList';
// import CustomerList from './CustomerList'; // Uncomment when ready

const Home = () => {
  const [section, setSection] = useState('home');

  const handleSectionClick = (sectionName) => {
    setSection(sectionName);
  };

  const renderSection = () => {
    switch (section) {
      case 'invoice':
        return (
          <div>
            <button onClick={() => handleSectionClick('home')} style={styles.backBtn}>
              ⬅ Back
            </button>
            <InvoiceList />
          </div>
        );
      case 'customer':
        return (
          <div>
            <button onClick={() => handleSectionClick('home')} style={styles.backBtn}>
              ⬅ Back
            </button>
            {/* <CustomerList /> */}
            <p>Customer List component not yet added.</p>
          </div>
        );
      default:
        return (
          <div style={styles.homeContainer}>
            <h1>Welcome to the Dashboard</h1>
            <p>This is the Home page. Please select an option:</p>
            <button onClick={() => handleSectionClick('invoice')} style={styles.optionBtn}>
              📄 View Invoice List
            </button>
            <button onClick={() => handleSectionClick('customer')} style={styles.optionBtn}>
              👥 View Customer List
            </button>
          </div>
        );
    }
  };

  return <div>{renderSection()}</div>;
};

const styles = {
  homeContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  optionBtn: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
  },
  backBtn: {
    margin: '10px',
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#888',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Home;
