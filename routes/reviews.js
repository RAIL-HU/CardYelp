const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {games, recurrence} = require('../seeds/seeds');
const {reviewSchema} = require('../schemas.js')
const ExpressError = require('../utils/ExpressError');
const Store = require('../models/store');
const Review = require('../models/review');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.post('/', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    const review = new Review(req.body.review);
    store.reviews.push(review);
    await review.save();
    await store.save();
    res.redirect(`/stores/${store._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Store.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/stores/${id}`);
}))

module.exports = router;