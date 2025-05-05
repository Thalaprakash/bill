import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  return (
    <div style={styles.container}>
      <nav style={styles.sidebar}>
        <h2 style={styles.sidebarHeader}>Dashboard</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link 
              to="." 
              style={location.pathname === "/dashboard" ? styles.activeNavLink : styles.navLink}
            >
              Home
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link 
              to="invoices" 
              style={location.pathname === "/dashboard/invoices" ? styles.activeNavLink : styles.navLink}
            >
              Invoices
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link 
              to="create-invoice" 
              style={location.pathname === "/dashboard/create-invoice" ? styles.activeNavLink : styles.navLink}
            >
              Create Invoice
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link 
              to="settings" 
              style={location.pathname === "/dashboard/settings" ? styles.activeNavLink : styles.navLink}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div style={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px",
  },
  sidebarHeader: {
    marginBottom: "20px",
  },
  navList: {
    listStyleType: "none",
    padding: 0,
  },
  navItem: {
    marginBottom: "10px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
  },
  activeNavLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#f8f9fa",
  }
};

export default Dashboard;
