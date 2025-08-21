import Joi from 'joi';

export const missionSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    photos: Joi.array().required(),
    videoUrl: Joi.string().optional(),
    needyPersonAddress: Joi.string().required(),
    needyPersonCity: Joi.string().required(),
    memberCount: Joi.object({
        son: Joi.number().required(),
        daughter: Joi.number().required()
    }),
    isWife: Joi.bool().required(),
    inclMother: Joi.bool().required(),
    inclFather: Joi.bool().required(),
    contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    documents: Joi.array().optional(),
    accountNumber: Joi.string().required().messages({
        "string.base": "Account number must be a string",
        "any.required": "Account number is required"
    }),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required().messages({
        "string.base": "IFSC code must be a string",
        "string.pattern.base": "IFSC code must be valid (e.g. ABCD0123456)",
        "any.required": "IFSC code is required"
    }),
    accountHolderName: Joi.string().required().messages({
        "string.base": "Account holder name must be a string",
        "any.required": "Account holder name is required"
    }),
    bankName: Joi.string().required().messages({
        "string.base": "Bank name must be a string",
        "any.required": "Bank name is required"
    }),
    upiId: Joi.string().optional(),
});
