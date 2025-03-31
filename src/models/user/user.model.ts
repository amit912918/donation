import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../helpers/common/init_mysql";

// Define interfaces for User attributes
interface UserAttributes {
  id: number;
  accountId: string;
  googleId?: string;
  facebookId?: string;
  provider: "google" | "facebook" | "itself";
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNo?: string;
  roles: "user" | "wholeseller" | "superadmin" | "admin";
  password?: string;
  otp?: string;
  otpTimeStampAt?: Date;
  loginAttempts: { count: number; attemptAt: Date };
  otpLoginAttempts: { count: number; attemptAt: Date };
  verified: boolean;
  notificationPreference?: Record<string, any>;
  bizomId?: string;
  status: "Active" | "Inactive";
  updateByStaff?: string;
  createdIstAt?: string;
  updatedIstAt?: string;
}

// Define optional fields for User creation
type UserCreationAttributes = Optional<UserAttributes, "id" | "accountId">;

// Define User model
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public accountId!: string;
  public googleId?: string;
  public facebookId?: string;
  public provider!: "google" | "facebook" | "itself";
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public contactNo?: string;
  public roles!: "user" | "wholeseller" | "superadmin" | "admin";
  public password?: string;
  public otp?: string;
  public otpTimeStampAt?: Date;
  public loginAttempts!: { count: number; attemptAt: Date };
  public otpLoginAttempts!: { count: number; attemptAt: Date };
  public verified!: boolean;
  public notificationPreference?: Record<string, any>;
  public bizomId?: string;
  public status!: "Active" | "Inactive";
  public updateByStaff?: string;
  public createdIstAt?: string;
  public updatedIstAt?: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accountId: {
      type: DataTypes.STRING,
      unique: true,
    },
    googleId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    provider: {
      type: DataTypes.ENUM("google", "facebook", "itself"),
      defaultValue: "itself",
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    contactNo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    roles: {
      type: DataTypes.ENUM("user", "wholeseller", "superadmin", "admin"),
      defaultValue: "wholeseller",
    },
    password: DataTypes.TEXT,
    otp: DataTypes.STRING,
    otpTimeStampAt: DataTypes.DATE,
    loginAttempts: {
      type: DataTypes.JSON,
      defaultValue: { count: 0, attemptAt: new Date() },
    },
    otpLoginAttempts: {
      type: DataTypes.JSON,
      defaultValue: { count: 0, attemptAt: new Date() },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notificationPreference: DataTypes.JSON,
    bizomId: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    updateByStaff: DataTypes.STRING,
    createdIstAt: DataTypes.STRING,
    updatedIstAt: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "User",
  }
);

// Add hook for generating `accountId`
User.addHook("beforeCreate", async (user: User) => {
  const lastSeller = await User.findOne({
    attributes: ["accountId"],
    order: [["id", "DESC"]],
    raw: true,
  });

  let tempAccountId: Number = !lastSeller ? 1 : Number(lastSeller.accountId.substring(3)) + 1;
  let accountId: String = tempAccountId.toString().padStart(7, "0");
  user.accountId = `RWC${accountId}`;
});

// Define interfaces for SellerInfo attributes
interface SellerInfoAttributes {
  sellerId: number;
  memberShipId?: string;
  membershipLevel: "Welcome" | "Blue" | "Silver" | "Gold";
  tierEntryDate?: Date;
  activities: Record<string, any>;
  gender?: "male" | "female";
  totalPoints: number;
  availablePoints: number;
  earnedPoints: number;
  finacialPoints: number;
  contactNo?: string;
  preferredContactTime?: string;
  dob?: string;
  dobPointStatus?: "Give" | "Deduct" | "Used";
  marriageDate?: string;
  gstNo?: string;
  billingAddress: Record<string, any>;
  agreedToTerms?: boolean;
  otp?: string;
  otpTimeStampAt?: Date;
  otpCount: number;
  verified: "verified" | "unverified" | "";
  activityStatus: "Fullfilled" | "NotFullfilled";
  updateByStaff?: string;
  createdIstAt?: string;
  updatedIstAt?: string;
}

// Define optional fields for SellerInfo creation
type SellerInfoCreationAttributes = Optional<SellerInfoAttributes, "activities" | "otpCount" | "totalPoints" | "availablePoints" | "earnedPoints" | "finacialPoints" | "billingAddress">;

// Define SellerInfo model
export class SellerInfo extends Model<SellerInfoAttributes, SellerInfoCreationAttributes> implements SellerInfoAttributes {
  public sellerId!: number;
  public memberShipId?: string;
  public membershipLevel!: "Welcome" | "Blue" | "Silver" | "Gold";
  public tierEntryDate?: Date;
  public activities!: Record<string, any>;
  public gender?: "male" | "female";
  public totalPoints!: number;
  public availablePoints!: number;
  public earnedPoints!: number;
  public finacialPoints!: number;
  public contactNo?: string;
  public preferredContactTime?: string;
  public dob?: string;
  public dobPointStatus?: "Give" | "Deduct" | "Used";
  public marriageDate?: string;
  public gstNo?: string;
  public billingAddress!: Record<string, any>;
  public agreedToTerms?: boolean;
  public otp?: string;
  public otpTimeStampAt?: Date;
  public otpCount!: number;
  public verified!: "verified" | "unverified" | "";
  public activityStatus!: "Fullfilled" | "NotFullfilled";
  public updateByStaff?: string;
  public createdIstAt?: string;
  public updatedIstAt?: string;
}

SellerInfo.init(
  {
    sellerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    memberShipId: DataTypes.STRING,
    membershipLevel: {
      type: DataTypes.ENUM("Welcome", "Blue", "Silver", "Gold"),
      defaultValue: "Welcome",
    },
    tierEntryDate: DataTypes.DATE,
    activities: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    availablePoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    earnedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    finacialPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    preferredContactTime: DataTypes.STRING,
    dob: DataTypes.STRING,
    dobPointStatus: {
      type: DataTypes.ENUM("Give", "Deduct", "Used"),
    },
    marriageDate: DataTypes.STRING,
    gstNo: DataTypes.STRING,
    billingAddress: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    agreedToTerms: DataTypes.BOOLEAN,
    otp: DataTypes.STRING,
    otpTimeStampAt: DataTypes.DATE,
    otpCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    verified: {
      type: DataTypes.ENUM("verified", "unverified", ""),
      defaultValue: "",
    },
    activityStatus: {
      type: DataTypes.ENUM("Fullfilled", "NotFullfilled"),
      defaultValue: "Fullfilled",
    },
    updateByStaff: DataTypes.STRING,
    createdIstAt: DataTypes.STRING,
    updatedIstAt: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "SellerInfo",
  }
);
