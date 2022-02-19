const fs = require('fs');
////////////////////////////////////////////////////////////////
// Mongoose
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env.development.local' });

////////////////////////////////////////////////////////////////
// Models
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

////////////////////////////////////////////////////////////////
// Connect to DB
const DB = process.env.DATABASE;

dbConnect().catch((err) => console.log(err));

async function dbConnect() {
  await mongoose.connect(DB);
  console.log('DB connection successful!');
}

////////////////////////////////////////////////////////////////
// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Import DATA into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete DATA from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
