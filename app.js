const fs = require('fs');
const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// // GET
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server!', app: 'Natours' });
// });

// // POST
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

// Get tours data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// GET
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// POST
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  // Create new object
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  // Add it to the array
  tours.push(newTour);

  // Save it to the file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
