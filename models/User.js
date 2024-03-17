const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: String, // Field to store the GitHub user ID
  name: {
    type: String,
    required: false 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false 
  }
  
});

const User = mongoose.model('User', UserSchema);

module.exports = User;