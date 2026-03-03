const Joi = require('joi');


module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),  // price should be positve
        image:Joi.string().allow("",null), // empty and null value is the allowed 


        geometry: Joi.object({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array()
                .items(Joi.number().required())
                .length(2)
                .required()
        }).required()

    }).required()
});  


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
});