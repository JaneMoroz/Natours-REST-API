const app = require('./app');

////////////////////////////////////////////////////////////////
// Server

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
