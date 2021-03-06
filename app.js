const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// Trust proxies
app.enable('trust proxy');

// Set PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

////////////////////////////////////////////////////////////////
// Global Middlewares

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:', 'blob:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: [
        "'self'",
        'https:',
        'http:',
        'blob:',
        'https://*.mapbox.com',
        ,
        'https://*.stripe.com',
        'data:',
        'ws:',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
      objectSrc: ["'none'"],
      workerSrc: ["'self'", 'data:', 'blob:'],
      childSrc: ["'self'", 'https:', 'blob:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'blob:', 'https:', 'ws:'],
    },
  })
);

// Implement Cors
app.use(
  cors({
    origin: '/',
    credentials: true,
  })
);

// app.options('*', cors());
// app.options('/api/v1/tours/:id', cors())

// Development logging
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

// Stripe Webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Express middleware: body parser, reading data from body into rq.body
app.use(express.json({ limit: '10kb' }));
// To get data from the body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// To parse cookie
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////////////////////////////////////////////////////////////////
// PUG Routes
app.use('/', viewRouter);

// API Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
