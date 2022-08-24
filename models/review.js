const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: String,
    rating: Number,
    body: String
}).required();

module.exports = mongoose.model("Review", reviewSchema);