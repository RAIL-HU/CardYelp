const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {games, recurrence} = require('../seeds/seeds');
const Store = require('../models/store');
const {isLoggedIn, validateStore, isStoreAuthor} = require('../middleware');
const stores = require('../controllers/stores');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(stores.index))
    .post(isLoggedIn, upload.array('store[image]'), validateStore, catchAsync(stores.createStore));

router.get('/new', isLoggedIn, stores.renderNewForm);

router.route('/:id')
    .get(catchAsync(stores.showStore))
    .put(isLoggedIn, isStoreAuthor, upload.array('store[image]'), validateStore, catchAsync(stores.updateStore))
    .delete(isLoggedIn, isStoreAuthor, catchAsync(stores.deleteStore));

router.get('/:id/edit', isLoggedIn, isStoreAuthor, catchAsync(stores.renderEditForm));

module.exports = router;