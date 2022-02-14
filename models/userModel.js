////////////////////////////////////////////////////////////////
// Mongoose
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Validator
const validator = require('validator');

////////////////////////////////////////////////////////////////
// Bcrypt
const bcrypt = require('bcryptjs');

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
    validate: {
      // This only works on 'create a new user' and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

// Encryption Middleware
userScheme.pre('save', async function (next) {
  // Run only if password was modified
  if (!this.isModified('password')) return next();

  // Has the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirmed field
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userScheme);

module.exports = User;
