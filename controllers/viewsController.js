const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get Data
  const tours = await Tour.find();
  // 2. Build Template
  // 3. Render Template Using Data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. Get Data for the Requested Tour (incls reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  // 2. Build Template
  // 3. Render Remplate Using the Data
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
