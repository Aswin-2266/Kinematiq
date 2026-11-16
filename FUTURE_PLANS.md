# Kinematiq — Future Roadmap & Progression Plans (`FUTURE_PLANS.md`)

This document outlines the planned future evolutions and stage progression mechanics for **Kinematiq**.

---

## 1. Multi-Stage Difficulty Progression System ("Stage Switches")

Instead of a one-size-fits-all workout, the application will introduce **Staged Workout Progression**, allowing users to start with foundational regressions and gradually level up as their stamina and strength improve.

### Stage 1: Foundation (Beginner)
*Designed for building joint stability, movement familiarity, and baseline conditioning.*
- **Exercise 1**: Bodyweight Box / Chair Squats or Tempo Air Squats
- **Exercise 2**: Knee Push-Ups or Incline Hands-Elevated Push-Ups
- **Exercise 3**: Alternating Reverse Step-Backs (shallow depth)
- **Exercise 4**: Standard Glute Bridges (two legs flat)
- **Exercise 5**: Incline Forearm Plank or Knee Forearm Plank (30s work / 30s rest optional)
- **Exercise 6**: Mountain Climbers (moderate tempo) instead of burpees

### Stage 2: Core Circuit (Intermediate — Current Preset)
*The gold-standard 15-20 min full-body circuit from the reference screenshot.*
- **Exercise 1**: Full Bodyweight Squats (thighs parallel to floor)
- **Exercise 2**: Standard Floor Push-Ups (rigid head-to-heel plank line)
- **Exercise 3**: Reverse Lunges (full knee-tap depth, alternating)
- **Exercise 4**: Glute Bridges with 2-second peak glute squeeze
- **Exercise 5**: Full Forearm Plank on toes (rigid body, 40s)
- **Exercise 6**: Full Burpees (or high-speed Mountain Climbers)

### Stage 3: High-Impact & Power (Advanced)
*Progressive overload and explosive power.*
- **Exercise 1**: Jump Squats or Bulgarian Split Squats (pause at bottom)
- **Exercise 2**: Diamond Push-Ups or Decline Feet-Elevated Push-Ups
- **Exercise 3**: Jumping Alternating Lunges
- **Exercise 4**: Single-Leg Glute Bridges (alternating legs each round)
- **Exercise 5**: Extended Plank or Walking Plank-to-Pushup transitions
- **Exercise 6**: Chest-to-Floor Burpees with vertical tuck jump

---

## 2. Dynamic Progression Triggers
- **Auto-Level Suggestion**: When a user logs 10 completed Stage 1 workouts in MongoDB without dropping intervals, prompt: *"You've mastered Stage 1! Ready to unlock Stage 2?"*
- **Mid-Session Dynamic Demote/Promote**: If a user is feeling exhausted during a Stage 2 workout, a 1-tap "Regress to Stage 1" button scales the remaining exercises down for that session so they finish safely without quitting.

---

## 3. Future Hardware & Wearable Integrations
- **Heart Rate Monitor Sync (Web Bluetooth API)**: Pair Polar H10 or Apple Watch BLE to display live heart rate zone on the timer screen.
- **Smartwatch Companion Web App**: WearOS and Apple Watch interval tap haptics.
- **Spotify / Apple Music Integration**: Background music ducking (music volume automatically dips by 50% during the 3-2-1 countdown voice cue).

---

## 4. Social & Accountability Features
- **Ghost Pacer / Synchronous Workout Room**: Work out simultaneously with friends over WebSockets.
- **Streak Freezes & Milestone Badges**: Gamified badges (e.g., "7-Day Iron Streak", "Century Club: 100 Rounds Completed").
