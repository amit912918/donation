import Joi from "joi";

// Joi Schema for validation
export const registerSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    dob: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().min(1).max(50).required(),
    state: Joi.string().min(1).max(50).optional(),
    country: Joi.string().min(1).max(50).optional(),
    language: Joi.string().valid("English", "Hindi").default("English"),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    password: Joi.string().min(6).max(20).optional(),
}).and('email', 'mobile'); // At least one of email or mobile is required

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    gender: Joi.string().valid("Male", "Female", "Others").optional(),
    dob: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().min(2).max(50).optional(),
    state: Joi.string().min(2).max(50).optional(),
    country: Joi.string().min(2).max(50).optional(),
    Language: Joi.string().valid("English", "Hindi").default("English"),
    email: Joi.string().email().optional(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
    password: Joi.string().min(6).max(20).optional(),
})