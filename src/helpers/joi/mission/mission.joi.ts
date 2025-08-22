import Joi from 'joi';

export const missionSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title must be a string",
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty"
  }),

  description: Joi.string().required().messages({
    "string.base": "Description must be a string",
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty"
  }),

  photos: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Photos must be an array",
    "any.required": "At least one photo is required"
  }),

  videoUrl: Joi.string().optional(),

  needyPersonAddress: Joi.string().required().messages({
    "any.required": "Needy person address is required",
    "string.empty": "Needy person address cannot be empty"
  }),

  needyPersonCity: Joi.string().required().messages({
    "any.required": "Needy person city is required",
    "string.empty": "Needy person city cannot be empty"
  }),

  memberCount: Joi.object({
    son: Joi.number().required().messages({
      "number.base": "Son count must be a number",
      "any.required": "Son count is required"
    }),
    daughter: Joi.number().required().messages({
      "number.base": "Daughter count must be a number",
      "any.required": "Daughter count is required"
    })
  }).required().messages({
    "object.base": "Member count must be an object",
    "any.required": "Member count is required"
  }),

  isWife: Joi.boolean().required().messages({
    "boolean.base": "isWife must be true or false",
    "any.required": "isWife field is required"
  }),

  inclMother: Joi.boolean().required().messages({
    "boolean.base": "inclMother must be true or false",
    "any.required": "inclMother field is required"
  }),

  inclFather: Joi.boolean().required().messages({
    "boolean.base": "inclFather must be true or false",
    "any.required": "inclFather field is required"
  }),

  contactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.base": "Contact number must be a string",
      "string.pattern.base": "Contact number must be exactly 10 digits",
      "any.required": "Contact number is required"
    }),

  documents: Joi.array().items(Joi.string()).optional(),

  accountNumber: Joi.string().required().messages({
    "string.base": "Account number must be a string",
    "any.required": "Account number is required",
    "string.empty": "Account number cannot be empty"
  }),

  ifscCode: Joi.string()
    .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .required()
    .messages({
      "string.base": "IFSC code must be a string",
      "string.pattern.base": "IFSC code must be valid (e.g. ABCD0123456)",
      "any.required": "IFSC code is required"
    }),

  accountHolderName: Joi.string().required().messages({
    "string.base": "Account holder name must be a string",
    "any.required": "Account holder name is required",
    "string.empty": "Account holder name cannot be empty"
  }),

  bankName: Joi.string().required().messages({
    "string.base": "Bank name must be a string",
    "any.required": "Bank name is required",
    "string.empty": "Bank name cannot be empty"
  }),

  upiId: Joi.string().optional()
});
