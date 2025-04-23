import Joi from "joi";

const registerSchema=Joi.object({
    username:Joi.string().min(4).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    confirmPassword:Joi.string().min(6).required()
    })

const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})

export {
    registerSchema,
    loginSchema
}