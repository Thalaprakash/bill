import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";

const App = () => {
  const [user, setUser] = useState(null);

  // Check if there's any logged-in user in localStorage
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  // Protected route for Admin
  const ProtectedAdminRoute = ({ children }) => {
    if (!user || user.role !== "admin") {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Routes for Signup and Login */}
        <Route path="/" element={<SignupPage setUser={setUser} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        {/* Admin Route */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        } />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="create-invoice" element={<InvoiceForm />} />
          <Route path="edit-invoice/:invoiceId" element={<InvoiceForm />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
