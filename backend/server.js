const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/authDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Signup route
app.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, email, password: hashedPassword, role, active: true });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({
      message: 'Login successful',
      user: { email: user.email, role: user.role, _id: user._id },
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get all users route (only accessible to admin)
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Activate user
app.patch('/activate/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.active = true;
    await user.save();
    res.json({ message: 'User activated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to activate user' });
  }
});

// Deactivate user
app.patch('/deactivate/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.active = false;
    await user.save();
    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to deactivate user' });
  }
});

// Start the server
app.listen(5000, () => console.log('Server started on port 5000'));
