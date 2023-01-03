const { campgroundSchema, reviewSchema } = require('./views/validateCampground.js');
const Review = require('./models/review.js');
const Campground = require('./models/campground.js')
const Joi = require('joi');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/user/login');
    }
    next()
}

module.exports.isAuthor = async function (req, res, next) {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permision');
        return res.redirect('/campground');
    }
    next();
}

module.exports.validateCampground = function (req, res, next) {

    const { error } = campgroundSchema.validate(req.body.campground);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new Error(msg, 400)
    }
    else {
        next();
    }

}

module.exports.validateReview = function (req, res, next) {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new Error(msg, 400);
    }
    else {
        next();
    }

}

module.exports.isReviewAuthor = async function (req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permision');
        return res.redirect('/campground');
    }
    next();
}





