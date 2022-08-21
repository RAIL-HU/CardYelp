const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors, games, recurrence} = require('./seeds');
const Store = require('../models/store');

mongoose.connect('mongodb://localhost:27017/cardstore');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Store.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const store = new Store({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: Math.ceil(Math.random() * 20),
            cardgame: games[Math.floor(Math.random() * 5)],
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            recurrence: recurrence[Math.floor(Math.random() * 7)],
            time: (Math.floor(Math.random() * 15) + 8) * 100
        })
        await store.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})