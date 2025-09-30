const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Removes whitespace from both ends
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Stores the email in lowercase
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  // Automatically adds 'createdAt' and 'updatedAt' fields
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;