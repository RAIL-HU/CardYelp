const mongoose = require('mongoose');
const { storeSchema } = require('../schemas');
const review = require('./review');
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

CardStoreSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('CardStore', CardStoreSchema);