const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Store = require('./models/store');
const {games, recurrence} = require('./seeds/seeds');

mongoose.connect('mongodb://localhost:27017/cardstore');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/stores', async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', {stores});
})

app.get('/stores/new', async (req, res) => {
    res.render('stores/new', {games, recurrence});
})

app.post('/stores', async(req, res) => {
    const store = new Store(req.body.store)
    await store.save();
    res.redirect(`/stores/${store._id}`);
})

app.get('/stores/:id', async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render('stores/show', {store});
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})