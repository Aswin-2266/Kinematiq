import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExercise extends Document {
  name: string;
  targetMuscles: string[];
  instructions: string;
  formCues: string[];
  watchOutWarning: string;
  visualKey: string;
  customImageUrl?: string;
  alternative?: {
    name: string;
    targetMuscles: string[];
    instructions: string;
    formCues: string[];
    watchOutWarning: string;
    visualKey: string;
  };
  regression?: {
    name: string;
    instructions: string;
  };
}

export const ExerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true },
    targetMuscles: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    formCues: [{ type: String, required: true }],
    watchOutWarning: { type: String, default: "" },
    visualKey: { type: String, required: true },
    customImageUrl: { type: String, default: "" },
    alternative: {
      name: { type: String },
      targetMuscles: [{ type: String }],
      instructions: { type: String },
      formCues: [{ type: String }],
      watchOutWarning: { type: String },
      visualKey: { type: String },
    },
    regression: {
      name: { type: String },
      instructions: { type: String },
    },
  },
  { _id: true }
);

export const Exercise: Model<IExercise> =
  mongoose.models.Exercise || mongoose.model<IExercise>("Exercise", ExerciseSchema);
