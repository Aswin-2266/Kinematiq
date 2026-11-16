import { Routine } from "@/types";

export const DEFAULT_EXERCISES = [
  {
    id: "ex-squats",
    name: "Bodyweight Squats",
    targetMuscles: ["Quads", "Glutes", "Core"],
    instructions: "Keep your chest up and sink your hips back until your thighs are parallel to the floor.",
    formCues: [
      "Keep chest tall and proud",
      "Sink hips back like sitting into a low chair",
      "Thighs parallel to floor",
      "Drive through heels to stand",
    ],
    watchOutWarning: "Don't let your knees cave inward or heels lift off the ground.",
    visualKey: "squats" as const,
    regression: {
      name: "Box / Chair Squats",
      instructions: "Sit back onto a chair or bench and stand back up without using hands for balance.",
    },
  },
  {
    id: "ex-pushups",
    name: "Push-Ups",
    targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
    instructions: "Maintain a straight line from your head to your heels; drop to your knees if needed.",
    formCues: [
      "Rigid straight line from head to heels",
      "Elbows at a 45-degree angle to torso",
      "Lower chest to a fist-width from floor",
      "Press through full palms to lockout",
    ],
    watchOutWarning: "Avoid letting your lower back sag or your hips pike upward into a tent.",
    visualKey: "pushups" as const,
    regression: {
      name: "Knee Push-Ups",
      instructions: "Drop your knees to the ground while keeping hips tucked and torso rigid.",
    },
  },
  {
    id: "ex-lunges",
    name: "Reverse Lunges",
    targetMuscles: ["Quads", "Hamstrings", "Glutes", "Balance"],
    instructions: "Step backward and lower your back knee gently toward the floor, alternating legs each rep.",
    formCues: [
      "Step backward with control",
      "Lower back knee gently toward floor",
      "Front knee directly stacked over front ankle",
      "Keep torso upright and drive up through front heel",
    ],
    watchOutWarning: "Don't bang your back knee onto the hard floor or lean forward excessively.",
    visualKey: "lunges" as const,
    regression: {
      name: "Shallow Step-Backs",
      instructions: "Step backward with a smaller stride without bending the back knee all the way down.",
    },
  },
  {
    id: "ex-bridges",
    name: "Glute Bridges",
    targetMuscles: ["Glutes", "Hamstrings", "Lower Back"],
    instructions: "Lie on your back, bend your knees with feet flat, and drive your hips up hard, squeezing at the top.",
    formCues: [
      "Feet flat on floor, hip-width apart",
      "Drive hips up aggressively through heels",
      "Hard 2-second squeeze of the glutes at peak height",
      "Maintain a straight line from shoulders to knees",
    ],
    watchOutWarning: "Don't hyperextend your lower back at the top; drive from hips, not spine.",
    visualKey: "bridges" as const,
    regression: {
      name: "Supported Glute Bridges",
      instructions: "Place hands flat alongside hips for extra stability while lifting hips.",
    },
  },
  {
    id: "ex-plank",
    name: "Forearm Plank",
    targetMuscles: ["Deep Core", "Shoulders"],
    instructions: "Hold a rigid, straight-line plank on your forearms, bracing your abs and glutes tightly.",
    formCues: [
      "Elbows directly under shoulders",
      "Squeeze glutes and brace abs like anticipating a punch",
      "Neck neutral, gaze toward the floor between hands",
      "Steady, controlled nasal breathing",
    ],
    watchOutWarning: "Don't let hips sag downward or pike up into a triangle to relieve tension.",
    visualKey: "plank" as const,
    regression: {
      name: "Knee Forearm Plank",
      instructions: "Lower knees to the ground while maintaining a tight core and straight torso line.",
    },
  },
  {
    id: "ex-cardio",
    name: "Burpees",
    targetMuscles: ["Cardio", "Full-Body Burn", "Quads", "Chest"],
    instructions: "Move at a steady, high-energy pace for the full 40 seconds to finish out the round.",
    formCues: [
      "Drop hands to floor, kick feet back to plank",
      "Quick chest-to-floor or jump feet back forward",
      "Explode upward with a small jump and overhead clap",
      "Pace your breathing for consistent output",
    ],
    watchOutWarning: "Don't rush so fast that you land awkwardly on stiff knees or round your spine.",
    visualKey: "burpees" as const,
    alternative: {
      name: "Mountain Climbers",
      targetMuscles: ["Core", "Cardio", "Shoulders", "Hip Flexors"],
      instructions: "From a high plank position, drive your knees alternately toward your chest at a rapid, steady tempo.",
      formCues: [
        "Hands pressed firmly under shoulders",
        "Drive knees toward chest like sprinting horizontally",
        "Keep hips level and steady",
        "Maintain light, rapid foot contact",
      ],
      watchOutWarning: "Avoid bouncing your hips high in the air while driving knees forward.",
      visualKey: "mountain-climbers" as const,
    },
    regression: {
      name: "Step-Back Burpees (No Jump)",
      instructions: "Step feet back one at a time into plank, step forward one at a time, and stand tall.",
    },
  },
];

export const DEFAULT_ROUTINE: Routine = {
  id: "routine-full-body-15min",
  title: "15-Minute Full-Body Circuit",
  description: "A quick, high-impact full-bodyweight workout for strength, power, and muscle tone using zero equipment. 3 rounds of 6 exercises.",
  isDefault: true,
  workDurationSeconds: 40,
  restDurationSeconds: 20,
  roundBreakDurationSeconds: 60,
  totalRounds: 3,
  exercises: DEFAULT_EXERCISES,
};
