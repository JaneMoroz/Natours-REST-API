////////////////////////////////////////////////////////////////
// Mongoose
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Validator
const validator = require('validator');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please, provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please, provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please, provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, provide a password'],
  },
});

const User = mongoose.model('User', userScheme);

module.exports = User;
