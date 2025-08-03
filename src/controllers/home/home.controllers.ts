import { NextFunction, Request, Response } from "express";
import { createError } from "@/helpers/common/backend.functions";
import BannerModel from "@/models/home/banner.models";
import { ContactOption } from "@/models/home/contactoption.models";
import { RequestType } from "@/helpers/shared/shared.type";

// 📌 Create a new banner
export const createBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { category, title, imageUrl, redirectUrl } = req.body;  // category can be home, mission or job

        if (!category && !title && !imageUrl) {
            throw createError(400, "Title, imageUrl and category are required");
        }

        const lastBanner = await BannerModel.findOne({ category }).sort("-sequence");
        const sequence = lastBanner ? lastBanner.sequence + 1 : 1;

        const bannerPayload = {
                    title,
                    imageUrl,
                    redirectUrl,
                    sequence,
                    category
                };
        const newBanner = new BannerModel(bannerPayload);
        await newBanner.save();            

        res.status(200).json({ 
            error: false,
            success: true,
            message: `Banner ${category} created successfully`
        });
    } catch (error: any) {
        console.log("Error in create banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 Create a new banner
// export const createBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { category = 'home', title, imageUrl, redirectUrl } = req.body;  // category can be home, mission or job

//         if (!category && !title && !imageUrl) {
//             throw createError(400, "Title and imageUrl are required");
//         }

//         const bannerPayload: any = {
//                     title,
//                     imageUrl,
//                     redirectUrl
//                 };

//         switch (category) {
//             case 'home':
//                 const lastBanner1 = await BannerModel.findOne().sort("-sequence");
//                 const sequence1 = lastBanner1 ? lastBanner1.sequence + 1 : 1;
//                 bannerPayload.sequence = sequence1;
//                 const newBanner1 = new BannerModel(bannerPayload);
//                 await newBanner1.save();
//                 break;
//             case 'mission':
//                 const lastBanner2 = await MissionBannerModel.findOne().sort("-sequence");
//                 const sequence2 = lastBanner2 ? lastBanner2.sequence + 1 : 1;
//                 bannerPayload.sequence = sequence2;
//                 const newBanner2 = new MissionBannerModel(bannerPayload);
//                 await newBanner2.save();
//                 break;
//             case 'job':
//                 const lastBanner3 = await JobBannerModel.findOne().sort("-sequence");
//                 const sequence3 = lastBanner3 ? lastBanner3.sequence + 1 : 1;
//                 bannerPayload.sequence = sequence3;
//                 const newBanner3 = new JobBannerModel(bannerPayload);
//                 await newBanner3.save();
//                 break;
//             default:
//                 break;
//         }

//         res.status(200).json({ 
//             error: false,
//             success: true,
//             message: `Banner ${category} created successfully`
//         });
//     } catch (error: any) {
//         console.log("Error in create banner", error);
//         next(createError(500, error?.message || "Internal server error"));
//     }
// };

// 📌 Upload banner image
export const uploadBannerImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            return next(createError(404, "No files uploaded."));
        }
        console.log(req.files, "req.files")

        // Files uploaded successfully
        const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
            originalName: file.originalname,
            filename: `/assets/banner/${file.filename}`,
            path: file.path,
        }));

        res.status(200).json({
            message: "Files uploaded successfully.",
            files: uploadedFiles,
        });
    } catch (error: any) {
        console.log("Add mission Images Error ::>>", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all banners
export const getAllBanners = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { category = 'home' } = req.query;
        console.log(category, "category");
        const banners = await BannerModel.find({ category, isActive: true }).sort("sequence");
        const bannerTitle = await BannerModel.find({ category, isActive: true }).sort("sequence").select("title -_id");
        res.status(200).json({
            error: false,
            success: true,
            bannerTitle,
            banners
        });
    } catch (error: any) {
        console.log("Error in get all banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 Update a banner
export const updateBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, imageUrl, redirectUrl, sequence, isActive } = req.body;
        const banner = await BannerModel.findById(req.params.id);

        if (!banner) {
            throw createError(404, "Banner not found");
        }

        banner.title = title || banner.title;
        banner.imageUrl = imageUrl || banner.imageUrl;
        banner.redirectUrl = redirectUrl || banner.redirectUrl;
        banner.sequence = sequence || banner.sequence;
        banner.isActive = isActive !== undefined ? isActive : banner.isActive;

        await banner.save();
        res.status(200).json({ message: "Banner updated successfully", banner });
    } catch (error: any) {
        console.log("Error in update banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 Soft delete a banner
export const deleteBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const banner = await BannerModel.findById(req.params.id);
        if (!banner) {
            throw createError(404, "Banner not found");
        }

        banner.isActive = false;
        await banner.save();

        res.status(200).json({ message: "Banner deleted (soft delete)", banner });
    } catch (error: any) {
        console.log("Error in delete banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 Update home data
export const updateHomeData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { content, image } = req.body;
        console.log(content, image);

        res.status(200).json({ message: "Home data created successfully" });
    } catch (error: any) {
        console.log("Error in create banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 get contact option
export const getContactOption = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const contact = await ContactOption.findOne();
        res.json(contact || {});
    } catch (error: any) {
        console.log("Error in fetch contact options", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 update contact option
export const updateContactOption = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { whatsapp, email, telegram, phone } = req.body;

        let contact = await ContactOption.findOne();

        if (!contact) {
            contact = new ContactOption({ whatsapp, email, telegram, phone });
        } else {
            contact.whatsapp = whatsapp;
            contact.email = email;
            contact.telegram = telegram;
            contact.phone = phone;
        }

        await contact.save();
        res.json({ success: true, error: false, data: contact });
    } catch (error: any) {
        console.log("Error in update contact option", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 update contact option
export const getHomeData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        res.status(200).json({ 
            success: true, 
            error: false,
            message: "Home data get successfully",
            title: "Who we are?",
            description: ""
        });
    } catch (error: any) {
        console.log("Error in update contact option", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

