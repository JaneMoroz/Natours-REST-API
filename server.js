////////////////////////////////////////////////////////////////
// Mongoose
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env.development.local' });

////////////////////////////////////////////////////////////////
// Get app
const app = require('./app');

////////////////////////////////////////////////////////////////
// Connect to DB
const DB = process.env.DATABASE;

dbConnect().catch((err) => console.log(err));

async function dbConnect() {
  const con = await mongoose.connect(DB);
  console.log('DB connection successful!');
}

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

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// });

const testTour = new Tour({
  name: 'The Lake Camper',
  price: 997,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log('Error 💥', err));

////////////////////////////////////////////////////////////////
// Server

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
