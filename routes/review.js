const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

const reviewController = require('../controllers/reviews.js');

const {
  validateReview,
  isLoggedIn,
  isReviewAuther,
} = require('../middleware.js');

// Post Review Route
router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

// Delete Review Route
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuther,
  wrapAsync(reviewController.destroyReview),
);

module.exports = router;
