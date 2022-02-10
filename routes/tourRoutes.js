const express = require('express');
const tourController = require('./../controllers/tourController');

////////////////////////////////////////////////////////////////
// Routing

const router = express.Router();

////////////////////////////////////////////////////////////////
// Middleware

// router.param('id', tourController.checkID);

// CheckBody Middleware
// Check if body contains the name and price property

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
