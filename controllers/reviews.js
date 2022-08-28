const Store = require('../models/store');
const Review = require('../models/review');
const {games, recurrence} = require('../seeds/seeds');

module.exports.createReview = async (req, res) => {
    const store = await Store.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    store.reviews.push(review);
    await review.save();
    await store.save();
    req.flash('success', 'Successfully posted your new review!');
    res.redirect(`/stores/${store._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Store.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review!');
    res.redirect(`/stores/${id}`);
};