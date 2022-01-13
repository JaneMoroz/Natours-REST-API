const express = require('express');

const app = express();

// GET
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server!', app: 'Natours' });
});

// POST
app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
