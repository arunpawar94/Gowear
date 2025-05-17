import mongoose, { Schema, Document } from "mongoose";

// Define User Interface
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
  accountVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose Schema
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
    accountVerified: {
      type: Boolean,
      required: [true, "Account verification status is required"],
    },
  },
  { timestamps: true }
);

// Export the User model
export default mongoose.model<IUser>("User", userSchema);
