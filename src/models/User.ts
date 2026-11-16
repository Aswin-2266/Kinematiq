import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  preferences: {
    theme: "light" | "dark" | "system";
    soundEnabled: boolean;
    voiceCoachEnabled: boolean;
    vibrationEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "dark",
      },
      soundEnabled: {
        type: Boolean,
        default: false, // OFF by default as requested
      },
      voiceCoachEnabled: {
        type: Boolean,
        default: false, // OFF by default as requested
      },
      vibrationEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
