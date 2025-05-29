import Joi from "joi"

const itinerarySchema = Joi.object({
    travelType: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    budget: Joi.number().min(0),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    
})

export default itinerarySchema;