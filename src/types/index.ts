export interface Exercise {
  id: string;
  name: string;
  targetMuscles: string[];
  instructions: string;
  formCues: string[];
  watchOutWarning: string;
  visualKey: "squats" | "pushups" | "lunges" | "bridges" | "plank" | "burpees" | "mountain-climbers";
  customImageUrl?: string;
  alternative?: {
    name: string;
    targetMuscles: string[];
    instructions: string;
    formCues: string[];
    watchOutWarning: string;
    visualKey: "burpees" | "mountain-climbers" | "pushups";
  };
  regression?: {
    name: string;
    instructions: string;
  };
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  isDefault: boolean;
  workDurationSeconds: number; // default: 40
  restDurationSeconds: number; // default: 20
  roundBreakDurationSeconds: number; // default: 60
  totalRounds: number; // default: 3
  exercises: Exercise[];
}

export type TimerPhase = "idle" | "get-ready" | "work" | "rest" | "round-break" | "completed";

export interface TimerState {
  phase: TimerPhase;
  currentRound: number;
  currentExerciseIndex: number;
  secondsRemaining: number;
  totalSecondsElapsed: number;
  isRunning: boolean;
  isMuted: boolean;
  isVoiceEnabled: boolean;
  activeAlternativeUsed?: boolean;
  activeRegressionUsed?: boolean;
}

export interface WorkoutSession {
  id: string;
  userId?: string;
  routineTitle: string;
  startedAt: string;
  completedAt: string;
  totalSeconds: number;
  completedRounds: number;
  completedExercises: number;
  estimatedCalories: number;
  syncedToCloud: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  soundEnabled: boolean; // default: false
  voiceCoachEnabled: boolean; // default: false
  vibrationEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}
