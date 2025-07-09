import Joi from 'joi';

const contactTypeEnum = ['work', 'home', 'personal'];

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().min(5).max(20).required(),
    contactType: Joi.string().valid(...contactTypeEnum).required(),
    isFavourite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().min(5).max(20).optional(),
    contactType: Joi.string().valid(...contactTypeEnum).optional(),
    isFavourite: Joi.boolean().optional(),
}).min(1);
