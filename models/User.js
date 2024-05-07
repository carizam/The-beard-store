const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  role: {type: String,enum: ['user', 'admin','superUser'],default: 'user'},
  first_name: { type: String, required: false }, 
  last_name: { type: String, required: false }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' },
  githubId: { type: String, required: false } 
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
