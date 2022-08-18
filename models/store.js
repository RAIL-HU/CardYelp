const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardStoreSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    cardgames: {
        type: String,
        required: true
    }
})