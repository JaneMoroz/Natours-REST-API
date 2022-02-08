////////////////////////////////////////////////////////////////
// Mongoose
const mongoose = require('mongoose');

// Scheme
const tourScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Model
const Tour = mongoose.model('Tour', tourScheme);

module.exports = Tour;
