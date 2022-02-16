const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////////////////////////////////////////////
// Global Middlewares

if (process.env.NODE_ENV === 'development') {
  // 3-rd party middleware
  app.use(morgan('dev'));
}

// Exmple of requests limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 request from one IP in one hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Express middleware
app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////////////////////////////////////////////////////////////////
// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
