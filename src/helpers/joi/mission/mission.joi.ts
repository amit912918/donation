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
    accountNumber: Joi.string().required(),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required(),
    accountHolderName: Joi.string().required(),
    bankName: Joi.string().required(),
    upiId: Joi.string().optional(),
});
