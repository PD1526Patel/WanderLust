const Joi = require('joi');
const categories = require('./utils/categories.js').map((c) => c.key);

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string()
      .valid(...categories)
      .allow('', null),
    image: Joi.object({
      filename: Joi.string().allow(''),
      url: Joi.string().allow(''),
    }).allow(null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
