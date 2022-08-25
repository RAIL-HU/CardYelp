const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {games, recurrence} = require('../seeds/seeds');
const {storeSchema} = require('../schemas.js')
const ExpressError = require('../utils/ExpressError');
const Store = require('../models/store');

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

router.get('/',catchAsync(async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', {stores});
}))

router.get('/new', (req, res) => {
    res.render('stores/new', {games, recurrence});
})

router.post('/', validateStore, catchAsync(async(req, res) => {
    const store = new Store(req.body.store)
    await store.save();
    res.redirect(`/stores/${store._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id).populate('reviews');
    res.render('stores/show', {store});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render('stores/edit', {store, games, recurrence});
}))

router.put('/:id', validateStore, catchAsync(async (req, res) => {
    const {id} = req.params;
    const store = await Store.findByIdAndUpdate(id, {...req.body.store});
    res.redirect(`/stores/${store._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    store = await Store.findByIdAndDelete(id);
    res.redirect('/stores');
}))

module.exports = router;