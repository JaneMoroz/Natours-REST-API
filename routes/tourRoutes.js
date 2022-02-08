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
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
