const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': 'Sorry, {{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.storeSchema = Joi.object({
    store: Joi.object({
        // image: Joi.string().required(),
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        cardgame: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        recurrence: Joi.string().required().escapeHTML(),
        time: Joi.number().required().min(800).max(2300)
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})