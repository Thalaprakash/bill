const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: 'user' // 'admin' or 'user'
  },
  active: {
    type: Boolean,
    default: true // user is active by default
  }
});

module.exports = mongoose.model('User', userSchema);
