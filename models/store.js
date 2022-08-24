const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardStoreSchema = new Schema({
    image: {
        type: String
    },
    title: {
        type: String
    },
    price: {
        type: Number,
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
        type: String
    },
    recurrence: {
        type: String,
        enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    },
    time: {
        type: Number,
        min: 800,
        max: 2300
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('CardStore', CardStoreSchema);