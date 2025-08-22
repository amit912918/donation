import mongoose, { Schema, Document } from "mongoose";

interface IDocumentInfo {
    type: string;
    size?: number;
    path_name: string;
    side: string;
}

interface IJob extends Document {
    jobTitle: string;
    jobDescription: string;
    minimumQualification: string;
    jobType: string;
    jobLocation: string;
    experience: string;
    salaryCriteria: string;
    jobAddress: string;
    jobCity: string;
    businessName: string;
    contactNumber: string;
    hideContact: boolean;
    isPublished: boolean;
    documents: IDocumentInfo[];
}

const JobSchema: Schema = new Schema(
  {
    jobTitle: { 
      type: String, 
      required: [true, "Job title is required"] 
    },
    jobDescription: { 
      type: String, 
      required: [true, "Job description is required"] 
    },
    minimumQualification: { 
      type: String, 
      required: [true, "Minimum qualification is required"] 
    },
    jobType: { 
      type: String, 
      enum: { 
        values: ["Full Time", "Part Time"], 
        message: "Job type must be either 'Full Time' or 'Part Time'" 
      }, 
      required: [true, "Job type is required"] 
    },
    jobLocation: { 
      type: String, 
      enum: { 
        values: ["On Site", "Remote / Online / Work From Home"], 
        message: "Job location must be either 'On Site' or 'Remote / Online / Work From Home'" 
      }, 
      required: [true, "Job location is required"] 
    },
    experience: { 
      type: String, 
      enum: { 
        values: ["Freshers", "Experienced", "Both"], 
        message: "Experience must be 'Freshers', 'Experienced', or 'Both'" 
      }, 
      required: [true, "Experience is required"] 
    },
    salaryCriteria: { 
      type: String, 
      required: [true, "Salary criteria is required"] 
    },
    jobAddress: { 
      type: String, 
      required: [true, "Job address is required"] 
    },
    jobCity: { 
      type: String, 
      required: [true, "Job city is required"] 
    },
    businessName: { 
      type: String, 
      required: [true, "Business name is required"] 
    },
    contactNumber: { 
      type: String, 
      required: [true, "Contact number is required"] 
    },
    hideContact: { 
      type: Boolean, 
      default: false 
    },
    jobCreatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Job creator (User) is required"] 
    },
    isPublished: { type: Boolean, default: false },
    status: { type: String, Enum: ['Pending', 'Approved', 'Disapproved'], default: 'Pending' },
    documents: [
      {
        type: { 
          type: String, 
          required: [true, "Document type is required"] 
        },
        side: { 
          type: String, 
          enum: { 
            values: ["Front", "Back"], 
            message: "Document side must be either 'Front' or 'Back'" 
          }, 
          required: [true, "Document side is required"] 
        },
        path_name: { 
          type: String, 
          required: [true, "Document path_name is required"] 
        }
      }
    ]
  }, 
  { timestamps: true }
);

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;
