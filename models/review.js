const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    username: String,
    rating: Number,
    body: String
});

module.exports = mongoose.model("Review", reviewSchema);