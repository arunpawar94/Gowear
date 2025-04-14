import mongoose, { Schema, Document } from 'mongoose';

// Define User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  dob: string;
  role: string;
}

// Define Mongoose Schema
const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
    role: { type: String, required: true }
});

// Export the User model
export default mongoose.model<IUser>('User', userSchema);
