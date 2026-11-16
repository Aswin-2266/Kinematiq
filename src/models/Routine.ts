import mongoose, { Schema, Document, Model } from "mongoose";
import { ExerciseSchema, IExercise } from "./Exercise";

export interface IRoutine extends Document {
  userId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  isDefault: boolean;
  workDurationSeconds: number;
  restDurationSeconds: number;
  roundBreakDurationSeconds: number;
  totalRounds: number;
  exercises: IExercise[];
  createdAt: Date;
  updatedAt: Date;
}

const RoutineSchema = new Schema<IRoutine>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    workDurationSeconds: {
      type: Number,
      default: 40,
    },
    restDurationSeconds: {
      type: Number,
      default: 20,
    },
    roundBreakDurationSeconds: {
      type: Number,
      default: 60,
    },
    totalRounds: {
      type: Number,
      default: 3,
    },
    exercises: [ExerciseSchema],
  },
  { timestamps: true }
);

export const Routine: Model<IRoutine> =
  mongoose.models.Routine || mongoose.model<IRoutine>("Routine", RoutineSchema);
