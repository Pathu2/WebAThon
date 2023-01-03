const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//////////////////////////////////////////////////////////////////////////
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

/////////////////////////////////////////////////////////////////////////

const Campground = require('../models/campground.js');
const catchAsync = require('../utils/catchAsync.js');
const Review = require('../models/review.js');
const { validateReview } = require('../middleware')
const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new Error(msg, 400);
    }
    else {
        next();
    }

}
const { campgroundSchema } = require('../views/validateCampground.js');
const { isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware.js');
const reviews = require('../controllers/review.js')

router.post('/campground/:id/reviews', validateReview, isLoggedIn, catchAsync(reviews.a1))

router.delete('/campground/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.a2))

module.exports = router;

