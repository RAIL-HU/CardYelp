const mongoose = require('mongoose');
const { storeSchema } = require('../schemas');
const review = require('./review');
const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true}};

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CardStoreSchema = new Schema({
    image: [ImageSchema],
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);

CardStoreSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/stores/${this._id}">${this.title}</a><strong><p>${this.location}</p>`;
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