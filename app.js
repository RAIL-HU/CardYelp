const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Store = require('./models/store');
const {games, recurrence} = require('./seeds/seeds');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const {nextTick} = require('process');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {storeSchema, reviewSchema} = require('./schemas.js')
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/cardstore');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateStore = (req, res, next) => {
    const {error} = storeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

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

app.get('/', (req, res) => {
    res.redirect('/stores');
})

app.get('/stores',catchAsync(async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', {stores});
}))

app.get('/stores/new', (req, res) => {
    res.render('stores/new', {games, recurrence});
})

app.post('/stores', validateStore, catchAsync(async(req, res) => {
    const store = new Store(req.body.store)
    await store.save();
    res.redirect(`/stores/${store._id}`);
}))

app.get('/stores/:id', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id).populate('reviews');
    res.render('stores/show', {store});
}))

app.get('/stores/:id/edit', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render('stores/edit', {store, games, recurrence});
}))

app.put('/stores/:id', validateStore, catchAsync(async (req, res) => {
    const {id} = req.params;
    const store = await Store.findByIdAndUpdate(id, {...req.body.store});
    res.redirect(`/stores/${store._id}`);
}))

app.delete('/stores/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    store = await Store.findByIdAndDelete(id);
    res.redirect('/stores');
}))

app.post('/stores/:id/reviews', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    const review = new Review(req.body.review);
    store.reviews.push(review);
    await review.save();
    await store.save();
    res.redirect(`/stores/${store._id}`);
}))

app.delete('/stores/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Store.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/stores/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Server Internal Error"} = err;
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})