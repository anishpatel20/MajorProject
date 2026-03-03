const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const controllersReview = require("../controllers/review.js");


//Review  post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(controllersReview.createReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(controllersReview.destroyReview));

module.exports = router;

