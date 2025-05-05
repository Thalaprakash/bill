import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPage() {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email'); // Assuming email or username is saved after login
    if (role !== 'admin') {
      alert('Access Denied');
      navigate('/login');
    }

    setAdmin({ email });

    // Fetch all users (admin can manage these)
    axios.get('http://localhost:5000/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleActivate = async (userId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/activate/${userId}`);
      alert(res.data.message);
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, active: true } : user
      );
      setUsers(updatedUsers);
    } catch (err) {
      alert('Failed to activate user');
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/deactivate/${userId}`);
      alert(res.data.message);
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, active: false } : user
      );
      setUsers(updatedUsers);
    } catch (err) {
      alert('Failed to deactivate user');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Logged in as: {admin ? admin.email : 'Loading...'}</p>

      <h3>Manage Users:</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <p>{user.username} ({user.email}) - {user.active ? 'Active' : 'Inactive'}</p>
            {user.active ? (
              <button onClick={() => handleDeactivate(user._id)}>Deactivate</button>
            ) : (
              <button onClick={() => handleActivate(user._id)}>Activate</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
