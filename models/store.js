const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardStoreSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cardgame: {
        type: String,
        enum: ['magic', 'yugioh', 'pokemon', 'weiss', 'vanguard']
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    recurrence: {
        type: String,
        enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    },
    time: {
        type: Number,
        required: true,
        min: 800,
        max: 2300
    },
});

module.exports = mongoose.model('CardStore', CardStoreSchema);