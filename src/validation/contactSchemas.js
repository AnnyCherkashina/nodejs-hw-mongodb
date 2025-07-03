import Joi from 'joi';

const stringRule = Joi.string().min(3).max(20);


const contactTypeEnum = Joi.string().valid('work', 'home', 'personal');

export const createContactSchema = Joi.object({
    name: stringRule.required(),
    phoneNumber: stringRule.required(),
    email: Joi.string().email().min(3).max(50),
    isFavourite: Joi.boolean(),
    contactType: contactTypeEnum.required(),
});

export const updateContactSchema = Joi.object({
    name: stringRule,
    phoneNumber: stringRule,
    email: Joi.string().email().min(3).max(50),
    isFavourite: Joi.boolean(),
    contactType: contactTypeEnum,
});
