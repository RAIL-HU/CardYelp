const Joi = require('joi');

module.exports.storeSchema = Joi.object({
    store: Joi.object({
        image: Joi.string().required(),
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        cardgame: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        recurrence: Joi.string().required(),
        time: Joi.number().required().min(800).max(2300)
    }).required()
});