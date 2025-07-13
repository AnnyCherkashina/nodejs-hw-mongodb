import Joi from "joi";

const contactTypeEnum = ["work", "home", "personal"];

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(5).max(20).required(),
    contactType: Joi.string().valid(...contactTypeEnum).required(),
    isFavourite: Joi.boolean().optional()
}).options({ abortEarly: false });

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    phoneNumber: Joi.string().min(5).max(20),
    contactType: Joi.string().valid(...contactTypeEnum),
    isFavourite: Joi.boolean()
}).min(1).options({ abortEarly: false });