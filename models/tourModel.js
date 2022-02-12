////////////////////////////////////////////////////////////////
// Mongoose
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Slugify
const slugify = require('slugify');

// Scheme
const tourScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourScheme.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Mongoose Middleware
// Document Middleware: runs before .save() and .create
tourScheme.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourScheme.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourScheme.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware
tourScheme.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourScheme.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds.`);
  next();
});

// Aggregation Middleware
tourScheme.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Model
const Tour = mongoose.model('Tour', tourScheme);

module.exports = Tour;
