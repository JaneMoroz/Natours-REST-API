const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

////////////////////////////////////////////////////////////////
// Middlewares

// Express middleware
app.use(express.json());

// 3-rd party middleware
app.use(morgan('dev'));

// Create our own middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 😏');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Get tours data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

////////////////////////////////////////////////////////////////
// Route handlers

// Get all tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

// Get tour
const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// Create Tour
const createTour = (req, res) => {
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
};

// Update Tour
const updateTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length - 1 || id < 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// Delete Tour
const deleteTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length - 1 || id < 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

////////////////////////////////////////////////////////////////
// Routes

// // GET All Tours
// app.get('/api/v1/tours', getAllTours);

// // GET Specific Tour
// app.get('/api/v1/tours/:id', getTour);

// // POST Create a New Tour
// app.post('/api/v1/tours', createTour);

// // PATCH
// app.patch('/api/v1/tours/:id', updateTour);

// // DELETE
// app.delete('/api/v1/tours/:id', deleteTour);

// Routing
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

////////////////////////////////////////////////////////////////
// Server

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
