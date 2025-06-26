import { NextFunction, Request, Response } from "express";
import User from "@/models/auth/auth.models";
import Profile from "@/models/auth/profile.models";
import { registerSchema, updateProfileSchema } from "@/helpers/joi/auth/auth.joi";
import { RegisterUserRequest } from "@/helpers/interface/auth/auth.interface";
import { createError, generateOtp, generateToken, validateContact } from "@/helpers/common/backend.functions";
import Otp from "@/models/auth/otp.models";
import { sendSms } from "@/helpers/service/communication/sms";
import { sendEmail } from "@/helpers/service/communication/email";
import { RequestType } from "@/helpers/shared/shared.type";

/**
 * @desc User Login
 * @route POST /auth/login
 * @access Public
 */

export const Login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Assuming a real authentication logic will be added later
    res.status(200).json({ message: "Login Successfully" });
  } catch (error) {
    console.error("Error occurred during login:", error);
    return next(createError(500, "An error occurred during login."));
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { contact, type, isEmail }: { contact: string; type: string; isEmail: boolean } = req.body;

    // Validate input
    if (!contact || !type || typeof isEmail === "undefined") {
      throw createError(400, "Contact are required");
    }

    // Validate OTP type
    const validTypes: string[] = ["signup", "login", "resetPassword", "forgotPassword"];
    if (!validTypes.includes(type)) {
      throw createError(400, "Invalid OTP type");
    }

    // Validate contact format
    if (!validateContact(contact, isEmail)) {
      throw createError(400, "Invalid contact format");
    }

    // Check if user already exists for 'signup'
    let existingUser = null;
    if (type === "signup") {
      existingUser = isEmail
        ? await User.findOne({ email: contact })
        : await User.findOne({ mobile: contact });

      if (existingUser) {
        throw createError(400, "User already exists with this contact");
      }
    } else if (type === "resetPassword" || type === "forgotPassword" || type === "login") {
      existingUser = isEmail
        ? await User.findOne({ email: contact })
        : await User.findOne({ mobile: contact });
    }

    let otpValue: string;
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
      otpValue = "123456";
    } else {
      otpValue = generateOtp();
    }

    // Invalidate existing OTPs of the same type before creating a new one
    await Otp.updateMany({ sentTo: contact, type, isValid: true }, { $set: { isValid: false } });

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    // Save the OTP
    const otp = new Otp({
      otp: otpValue,
      sentTo: contact,
      isEmail: isEmail,
      expiry: expiryTime,
      type: type,
      isValid: true,
    });

    await otp.save();

    // Send OTP via SMS or Email
    // if (process.env.NODE_ENV !== "development") {
    //   if (!isEmail) {
    //     await sendSms(contact, otpValue);
    //   } else {
    //     await sendEmail(contact, otpValue);
    //   }
    // }

    res.status(200).json({ message: "OTP sent successfully", otp: otpValue });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    next(error);
  }
};

/**
 * @desc Register User
 * @route POST /auth/register-user
 * @access Public
 */
export const registerUser = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, gender, dob, address, city, language, email, mobile }: RegisterUserRequest = req.body;

    // Validate request body
    const { error } = registerSchema.validate({ name, gender, dob, address, city, language, email, mobile });

    if (error) {
      console.log(error?.details[0].message);
      return next(createError(400, error.details[0].message));
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return next(createError(400, "User with this email or mobile already exists."));
    }

    // Create user profile
    const profileData: any = {
      gender: gender,
      dob: dob,
      city: city,
      address: address,
      Language: language,
      image: `https://ui-avatars.com/api/?uppercase=true&background=random&color=random&size=128`,
    };

    // Create a new user
    const user = new User({
      name,
      confirmed: true,
      profile: profileData,
      ...(email && { email }),
      ...(mobile && { mobile }),
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return success response
    res.status(200).json({
      message: "User registered successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || null,
        mobile: user.mobile || null,
        confirmed: user.confirmed,
        token,
      },
    });
  } catch (error: any) {
    console.error("Error in register user:", error);
    return next(createError(500, error?.message || "Internal server error"));
  }
};

export const updateUserProfile = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.payload?.appUserId;

    const { name, gender, dob, address, city, Language } = req.body;

    const { error } = updateProfileSchema.validate({ name, gender, dob, address, city, Language });
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const updateData: any = {};

    if (name) updateData.name = name;

    // Only include profile subfields if any are provided
    const profileUpdates: any = {};
    if (gender) profileUpdates.gender = gender;
    if (dob) profileUpdates.dob = dob;
    if (address) profileUpdates.address = address;
    if (city) profileUpdates.city = city;
    if (Language) profileUpdates.Language = Language;

    if (Object.keys(profileUpdates).length > 0) {
      updateData.profile = profileUpdates;
    }

    const updatedProfile = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedProfile) {
      return next(createError(404, "User not found"));
    }


    res.status(200).json({
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return next(createError(500, error.message || "Internal server error."));
  }
};

export const updateUserProfileImage = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.payload?.appUserId;

    const { image } = req.body;


    if (!image) {
      return next(createError(400, "Check all field"));
    }

    const updateData: any = {};

    // Only include profile subfields if any are provided
    const profileUpdates: any = {};
    if (image) profileUpdates.image = image;

    if (Object.keys(profileUpdates).length > 0) {
      updateData.profile = profileUpdates;
    }

    const updatedProfile = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedProfile) {
      return next(createError(404, "User not found"));
    }


    res.status(200).json({
      message: "Profile image updated successfully.",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Error updating profile image:", error);
    return next(createError(500, error.message || "Internal server error."));
  }
};

export const getUserProfile = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.payload?.appUserId;
    console.log(userId, "userId");

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    res.status(200).json({
      error: false,
      message: "Profile get successfully!",
      user
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return next(createError(500, error.message || 'Internal server error'));
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { contact, otp, isEmail, type }: { contact: string; otp: string; isEmail: boolean; type: string } = req.body;

    // Validate input
    if (!contact || !otp || typeof isEmail === 'undefined' || !type) {
      throw createError(400, "Contact, OTP, isEmail, and type are required");
    }

    // Validate contact format
    if (!validateContact(contact, isEmail)) {
      throw createError(400, "Invalid contact format");
    }

    // Validate OTP type
    const validTypes: string[] = ['signup', 'login', 'resetPassword', 'forgotPassword'];
    if (!validTypes.includes(type)) {
      throw createError(400, "Invalid OTP type");
    }

    // Find the most recent OTP record by sorting based on the `createdAt` field in descending order
    const otpRecord = await Otp.findOneAndUpdate(
      { sentTo: contact, type, isEmail, isValid: true },
      { $set: { isValid: false } }, // Invalidate OTP in the same query
      { sort: { createdAt: -1 }, new: true }
    );

    // Check if OTP exists and is valid
    if (!otpRecord || otpRecord.otp !== otp) {
      throw createError(400, "Invalid OTP");
    }

    // Check if OTP has expired
    if (otpRecord.expiry < new Date()) {
      throw createError(400, "OTP has expired");
    }

    let existingUser: any = null;
    if (type === 'signup') {
      let existing = true;
      existingUser = await User.findOne({ mobile: contact });
      if (!existingUser) {
        existing = false;
        const userData = {
          name: 'NA',
          password: '12345', // Plain password, will be hashed in the pre-save hook
          mobile: contact,
          confirmed: true,
        };
        const user = new User(userData);
        await user.save();

        existingUser = user;
      }
      const token = generateToken(existingUser._id);
      res.status(200).json({ message: 'OTP verified successfully', token, user: existingUser, existing });
      return;
    }
    if (type === 'login') {
      existingUser = await User.findOne({ mobile: contact });
      res.status(200).json({
        message: 'OTP verified successfully',
        token: existingUser ? generateToken(existingUser._id) : null,
        user: existingUser ? existingUser : null,
        existing: existingUser ? true : false
      });
      return;
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error: any) {
    console.error("Error in verify otp", error);
    next(createError(500, error?.message || "Internal server error"));
  }
};
