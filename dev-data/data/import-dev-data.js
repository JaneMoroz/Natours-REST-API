const fs = require('fs');
////////////////////////////////////////////////////////////////
// Mongoose
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env.development.local' });

////////////////////////////////////////////////////////////////
// Tour Model
const Tour = require('./../../models/tourModel');
const { off } = require('process');

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

// Import DATA into DB
const importData = async () => {
  try {
    await Tour.create(tours);
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
