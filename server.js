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

////////////////////////////////////////////////////////////////
// Server

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
