const { storeSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Store = require('./models/store');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please login before you proceed');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateStore = (req, res, next) => {
    const {error} = storeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isStoreAuthor = async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have permission to do that!");
        return res.redirect(`/stores/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have permission to do that!");
        return res.redirect(`/stores/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}