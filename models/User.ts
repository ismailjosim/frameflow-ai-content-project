import mongoose, { type Document, type Model, Schema } from "mongoose";

export type UserRole = "admin" | "creator";

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: { type: String, enum: ["admin", "creator"], default: "creator" },
    image: { type: String },
  },
  { timestamps: true },
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
