const Store = require('../models/store');
const {games, recurrence} = require('../seeds/seeds');

module.exports.index = async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', {stores});
}

module.exports.renderNewForm = (req, res) => {
    res.render('stores/new', {games, recurrence});
}

module.exports.createStore = async (req, res, next) => {
    const store = new Store(req.body.store);
    store.image = req.files.map(f => ({url: f.path, filename: f.filename}));
    store.author = req.user._id;
    await store.save();
    req.flash('success', 'Successfully made a new store!');
    res.redirect(`/stores/${store._id}`)
}

module.exports.showStore = async (req, res,) => {
    const store = await Store.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!store) {
        req.flash('error', 'Cannot find that store!');
        return res.redirect('/stores');
    }
    res.render('stores/show', { store });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id)
    if (!store) {
        req.flash('error', 'Cannot find that store!');
        return res.redirect('/stores');
    }
    res.render('stores/edit', {store, games, recurrence});
}

module.exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, {...req.body.store});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    store.image.push(...imgs);
    await store.save();
    req.flash('success', 'Successfully updated store!');
    res.redirect(`/stores/${store._id}`)
}

module.exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    await Store.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted store!')
    res.redirect('/stores');
}