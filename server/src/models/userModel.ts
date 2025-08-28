import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "product_manager" | "admin";
  profileImage: {
    imgUrl: string;
    publicId: string;
  };
  dateOfBirth: string;
  methodToSignUpLogin: string;
  termsAndPolicies: boolean;
  emailVerified: boolean;
  adminVerification: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, "User name is required."] },
    email: {
      type: String,
      required: [true, "User email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [
        function (this: IUser) {
          return this.methodToSignUpLogin === "email";
        },
        "Password is required.",
      ],
    },
    role: {
      type: String,
      required: [true, "Type of user is required."],
      enum: {
        values: ["user", "product_manager", "admin"],
        message: "User must be either 'user', 'product_manager' or 'admin'.",
      },
    },
    profileImage: {
      type: { imgUrl: { type: String }, publicId: { type: String } },
    },
    dateOfBirth: {
      type: String,
    },
    methodToSignUpLogin: {
      type: String,
      required: [true, "Sign up method type is required."],
    },
    termsAndPolicies: {
      type: Boolean,
      required: [true, "Terms and Plicies status is required."],
    },
    emailVerified: {
      type: Boolean,
      required: [true, "Email verification status is required"],
    },
    adminVerification: {
      type: String,
      required: [true, "Account verification status is required"],
      enum: {
        values: ["pending", "approved", "rejected"],
        message:
          "Admin verfication must be either 'pending', 'approved' or 'rejected'.",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false; // Social login users (no password set)
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IUser>("User", userSchema);
