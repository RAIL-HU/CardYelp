const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Store = require('./models/store');

mongoose.connect('mongodb://localhost:27017/cardstore');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home');
})
app.get('/addnewstore', async (req, res) => {
    const store = new Store({title: 'Arroyo Cards', price: 1, cardgame: 'weiss', description: 'AV residents only!!!', location: '1000 Arroyo Dr, Irvine, CA 92617', recurrence: 'fri', time: 1900})
    await store.save();
    res.send(store);
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})