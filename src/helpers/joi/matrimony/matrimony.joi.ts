import { NextFunction } from "express";
import Joi from "joi";

export const candidateSchema = Joi.object({
    name: Joi.string().required(),
    nickName: Joi.string().optional(),
    gender: Joi.string().optional(),
    dob: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    mobile: Joi.string().required(),
    email: Joi.string().email().optional(),
    qualification: Joi.string().required(),
    college: Joi.string().required(),
    occupation: Joi.string().required(),
    language: Joi.string().optional(),
    serviceTypes: Joi.array().items(Joi.string()).required(),
    maritalStatus: Joi.string().required(),
    assetInfo: Joi.string().required(),
    drink: Joi.string().required(),
    smoke: Joi.string().required(),
    food: Joi.string().required(),
    photo: Joi.string().optional(),
});

export const siblingSchema = Joi.object({
    name: Joi.string().required(),
    occupation: Joi.string().required(),
});

export const createBiodataSchema = Joi.object({
    profileCreatedBy: Joi.string().required(),
    relationWithCandiate: Joi.string().required(),
    profileCount: Joi.string().required(),
    gender: Joi.string().required(),
    contact: Joi.string().required(),
    candidate: Joi.array().items(candidateSchema).required(),
    gotraDetails: Joi.object({
        selfGotra: Joi.string().required(),
        maaGotra: Joi.string().required(),
        dadiGotra: Joi.string().required(),
        naniGotra: Joi.string().optional(),
        additionalGotra: Joi.object().optional(),
    }).required(),
    familyDetails: Joi.object({
        fatherName: Joi.string().required(),
        fatherOccupation: Joi.string().required(),
        motherName: Joi.string().required(),
        motherOccupation: Joi.string().required(),
        grandfatherName: Joi.string().required(),
        grandfatherOccupation: Joi.string().required(),
        siblings: Joi.array().items(siblingSchema).required(),
        familyLivingIn: Joi.string().required(),
        elderBrotherName: Joi.string().required(),
        elderBrotherOccupation: Joi.string().required(),
        additionalInfo: Joi.string().optional(),
    }).required(),
});

export const updateBiodataSchema = Joi.object({
    profileCreatedBy: Joi.string().required(),
    relationWithCandiate: Joi.string().required(),
    profileCount: Joi.string().required(),
    gender: Joi.string().required(),
    contact: Joi.string().required(),
    candidate: Joi.array().items(candidateSchema).required(),
    gotraDetails: Joi.object({
        selfGotra: Joi.string().required(),
        maaGotra: Joi.string().required(),
        dadiGotra: Joi.string().required(),
        naniGotra: Joi.string().optional(),
        additionalGotra: Joi.object().optional(),
    }).required(),
    familyDetails: Joi.object({
        fatherName: Joi.string().required(),
        fatherOccupation: Joi.string().required(),
        motherName: Joi.string().required(),
        motherOccupation: Joi.string().required(),
        grandfatherName: Joi.string().required(),
        grandfatherOccupation: Joi.string().required(),
        siblings: Joi.array().items(siblingSchema).required(),
        familyLivingIn: Joi.string().required(),
        elderBrotherName: Joi.string().required(),
        elderBrotherOccupation: Joi.string().required(),
        additionalInfo: Joi.string().optional(),
    }).required(),
});