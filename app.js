const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////////////////////////////////////////////
// Middlewares

if (process.env.NODE_ENV === 'development') {
  // 3-rd party middleware
  app.use(morgan('dev'));
}

// Express middleware
app.use(express.json());

// // 3-rd party middleware
// app.use(morgan('dev'));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Create our own middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 😏');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////////////////////////////////////////////////////////////////
// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
