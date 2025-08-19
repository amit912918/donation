import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    businessType: string,
    businessSector: string,
    positionInBusiness: string,
    yearlyIncome: string
}

const JobSchema: Schema = new Schema({
    businessType: { type: String },
    businessSector: { type: String },
    positionInBusiness: { type: String },
    yearlyIncome: { type: String }
}, { timestamps: true });

export interface ICandidate extends Document {
    name: string;
    nickName?: string;
    gender?: string;
    dob: string;
    address: string;
    city: string;
    mobile: string;
    email?: string;
    qualification: string;
    college: string;
    occupation: string;
    jobDetail: IJob,
    language?: string;
    serviceTypes: string[];
    maritalStatus: string;
    assetInfo: string;
    drink: string;
    smoke: string;
    food: string;
    photos?: string[];
}

const CandidateSchema: Schema = new Schema({
    name: { type: String, required: true },
    nickName: { type: String },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true },
    qualification: { type: String, required: true },
    college: { type: String, required: true },
    occupation: { type: String, required: true },
    jobDetail: JobSchema,
    language: { type: String, default: "English" },
    serviceTypes: [{ type: String }],
    maritalStatus: { type: String, required: true },
    assetInfo: { type: String, required: true },
    drink: { type: String, required: true },
    smoke: { type: String, required: true },
    food: { type: String, required: true },
    photos: { type: [String], default: [] },
}, { timestamps: true });

export interface ISibling {
    siblingRelation: string;
    name: string;
    occupation: string;
    maritalStatus: string;
}

export interface IBiodata extends Document {
    profileCreatedById: mongoose.Types.ObjectId;
    profileCreatedBy: string;
    relationWithCandiate: string;
    profileCount: string;
    gender: string;
    contact: string;
    candidate: ICandidate[];
    state: string;
    city: string;
    BicholiyaId: mongoose.Types.ObjectId;
    gotraDetails: {
        selfGotra: string;
        maaGotra: string;
        dadiGotra: string;
        naniGotra?: string;
        additionalGotra?: Record<string, any>;
    };
    familyDetails: {
        fatherName: string;
        fatherOccupation: string;
        motherName: string;
        motherOccupation: string;
        grandfatherName: string;
        grandfatherOccupation: string;
        siblings: ISibling[];
        familyLivingIn: string;
        // elderBrotherName: string;
        // elderBrotherOccupation: string;
        additionalInfo?: string;
    };
    paymentStatus?: string;
    isVerified?: boolean;
    status?: string;
    statusUpdateTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const SiblingSchema = new Schema({
    siblingRelation: String,
    siblingName: String,
    occupation: String,
    maritalStatus: String
});

const BiodataSchema: Schema = new Schema<IBiodata>({
    profileCreatedById: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    profileCreatedBy: { type: String, required: true },
    relationWithCandiate: { type: String, required: true },
    profileCount: { type: String, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    candidate: [CandidateSchema],
    state: { type: String, required: true },
    city: { type: String, required: true },
    BicholiyaId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gotraDetails: {
        selfGotra: { type: String },
        maaGotra: { type: String },
        dadiGotra: { type: String },
        naniGotra: { type: String },
        additionalGotra: { type: Object },
    },
    familyDetails: {
        fatherName: { type: String },
        fatherOccupation: { type: String },
        motherName: { type: String },
        motherOccupation: { type: String },
        grandfatherName: { type: String },
        grandfatherOccupation: { type: String },
        siblings: [SiblingSchema],
        familyLivingIn: { type: String },
        // elderBrotherName: { type: String },
        // elderBrotherOccupation: { type: String },
        additionalInfo: { type: String },
    },
    paymentStatus: { type: String, ENUM: ['pending', 'rejected', 'completed'], default: 'pending' },
    isVerified: { type: Boolean, default: false }, // verified by admin
    status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' }, // maintained by bicholiya
    statusUpdateTime: {
            type: Date,
            default: ""
    },
}, { timestamps: true });

BiodataSchema.pre<IBiodata>('save', function (next) {
    const biodata = this; // ✅ Now 'this' is correctly typed as IBiodata

    let allFieldsFilled = true;

    const checkFields = [
        biodata.profileCreatedById,
        biodata.profileCreatedBy,
        biodata.relationWithCandiate,
        biodata.profileCount,
        biodata.gender,
        biodata.contact,
        biodata.state,
        biodata.city,
        biodata.BicholiyaId,
    ];

    const gotra = biodata.gotraDetails || {};
    checkFields.push(gotra.selfGotra, gotra.maaGotra, gotra.dadiGotra);

    const family = biodata.familyDetails || {};
    checkFields.push(
        family.fatherName,
        family.fatherOccupation,
        family.motherName,
        family.motherOccupation,
        family.grandfatherName,
        family.grandfatherOccupation,
        family.familyLivingIn
    );

    // Candidate check
    if (biodata.candidate.length > 0) {
        const candidate = biodata.candidate[0];
        const job = candidate.jobDetail || {};

        const candidateFields = [
            candidate.name,
            candidate.dob,
            candidate.address,
            candidate.city,
            candidate.mobile,
            candidate.qualification,
            candidate.college,
            candidate.occupation,
            candidate.maritalStatus,
            candidate.assetInfo,
            candidate.drink,
            candidate.smoke,
            candidate.food,
            ...(candidate.serviceTypes || []),
        ];

        const jobFields = [
            job.businessType,
            job.businessSector,
            job.positionInBusiness,
            job.yearlyIncome,
        ];

        checkFields.push(...candidateFields, ...jobFields);
    } else {
        allFieldsFilled = false;
    }

    // Sibling check
    if (!family.siblings || family.siblings.length === 0) {
        allFieldsFilled = false;
    } else {
        for (let sibling of family.siblings) {
            if (
                !sibling.name ||
                !sibling.occupation ||
                !sibling.maritalStatus ||
                !sibling.siblingRelation
            ) {
                allFieldsFilled = false;
                break;
            }
        }
    }

    if (checkFields.some((f) => f === undefined || f === null || f === '')) {
        allFieldsFilled = false;
    }

    biodata.isVerified = allFieldsFilled;
    console.log(allFieldsFilled, "allFieldsFilled");
    next();
});

// ✅ Correct Export
const Biodata = mongoose.model<IBiodata>("Biodata", BiodataSchema);
export default Biodata;

