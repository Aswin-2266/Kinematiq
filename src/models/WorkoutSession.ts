import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkoutSession extends Document {
  userId?: mongoose.Types.ObjectId;
  routineId?: string;
  routineTitle: string;
  startedAt: Date;
  completedAt: Date;
  totalSeconds: number;
  completedRounds: number;
  completedExercises: number;
  estimatedCalories: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSessionSchema = new Schema<IWorkoutSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    routineId: {
      type: String,
      default: "",
    },
    routineTitle: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    totalSeconds: {
      type: Number,
      required: true,
    },
    completedRounds: {
      type: Number,
      required: true,
    },
    completedExercises: {
      type: Number,
      required: true,
    },
    estimatedCalories: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const WorkoutSession: Model<IWorkoutSession> =
  mongoose.models.WorkoutSession ||
  mongoose.model<IWorkoutSession>("WorkoutSession", WorkoutSessionSchema);
