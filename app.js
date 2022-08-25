const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const stores = require('./routes/stores');
const reviews = require('./routes/reviews')

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

app.use("/stores", stores);
app.use("/stores/:id/reviews", reviews)

app.get('/', (req, res) => {
    res.render('/home');
})

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