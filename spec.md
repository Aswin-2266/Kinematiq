# Kinematiq — Technical Specification & Progress Tracker (`spec.md`)

**Product**: Kinematiq — Mobile-First Interval Circuit & Bodyweight Training PWA  
**Target Device**: Mobile Phones (iOS Safari & Android Chrome via "Add to Home Screen" PWA) + Desktop  
**Color Theme**: *Kinetic Pulse* (Light Mode: Clean Porcelain `#FAFAFA` with Fiery Coral `#FF5E1E` & Emerald `#10B981` | Dark Mode: Deep Obsidian `#0B0F19` with Sunset Orange `#FF7A00` & Neon Emerald)  
**Database**: MongoDB Atlas Cloud (`MONGODB_URI`) with client-side offline resilience fallback  

---

## Master Progress Chart

| Phase | Milestone | Scope / Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Project Scaffolding & Design Foundation** | Next.js 14 App Router, TypeScript, Tailwind CSS, Kinetic Pulse theme variables, PWA Manifest, mobile viewport meta tags | `[x] Completed` |
| **Phase 2** | **MongoDB Layer & Data Models** | Mongoose connection pool, User, Exercise, Routine, WorkoutSession schemas, offline sync engine, seed data for 6 screenshot exercises | `[x] Completed` |
| **Phase 3** | **Mobile APIs (Audio Engine & Wake Lock)** | Web Audio API gym beeps (zero external assets), Web Speech API voice coach, Screen Wake Lock API (keeps phone screen on) | `[x] Completed` |
| **Phase 4** | **Visual Form Motion Engine** | High-contrast animated visual guides for all 6 exercises (Squats, Push-Ups, Reverse Lunges, Glute Bridges, Plank, Burpees/Mountain Climbers) + Form Cues | `[x] Completed` |
| **Phase 5** | **Workout Interval Timer & State Machine** | 40s Work / 20s Rest / 60s Round Break cycle, 3 full rounds, "Up Next" preview during 20s rest, large mobile touch targets | `[x] Completed` |
| **Phase 6** | **Authentication, History & Custom Builder** | Multi-user JWT auth, Workout completion summary, MongoDB session history & streaks, Custom routine editor | `[ ] Pending` |
| **Phase 7** | **Verification, Mobile Polish & AGENTS.md** | Automated TypeScript build verification, mobile touch ergonomics test, documentation in AGENTS.md, final walkthrough | `[ ] Pending` |

---

## Detailed Phase Breakdown

### Phase 1: Project Scaffolding & Design Foundation
- [x] Initialize Next.js 14 project with TypeScript, Tailwind CSS, Lucide React
- [x] Configure `tailwind.config.ts` with Kinetic Pulse light & dark color tokens
- [x] Create PWA web manifest (`manifest.json`) and iOS touch icons
- [x] Build responsive shell with mobile-safe area insets (`env(safe-area-inset-top)`) and Light/Dark toggle

### Phase 2: MongoDB Layer & Data Models
- [x] Implement cached Mongoose connection (`src/lib/mongodb.ts`) for serverless cloud Atlas
- [x] Implement Mongoose Schemas:
  - `User`: Email, password hash, user preferences (audio, voice coach, theme)
  - `Exercise`: Name, muscles, instructions, form cues, SVG visual key, alternative
  - `Routine`: 15-20 Min Full-Body Circuit preset (40s work, 20s rest, 3 rounds, 60s break)
  - `WorkoutSession`: Saved history logs, duration, calories, rounds
- [x] Create offline storage fallback (`src/lib/offlineQueue.ts`) so workouts save locally if offline
- [x] Health check and workout session API routes (`/api/health`, `/api/workouts`)

### Phase 3: Hardware & Mobile APIs
- [x] Build Web Audio API synthesizer (`src/lib/audioEngine.ts`):
  - **Default State**: Audio is **MUTED/OFF by default**.
  - 880Hz Start chime
  - 440Hz Rest tone
  - 587Hz 3-2-1 countdown ticks
  - Multi-tone round completion sound
- [x] Build Web Speech API voice coach: Spoken notifications ("Next: Forearm Plank", "Begin Squats")
- [x] Add prominent Audio ON/OFF and Voice Coach ON/OFF toggles on the main workout screen and navbar
- [x] Safely unlock and resume Web Audio AudioContext only when user actively toggles sound ON
- [x] Build Screen Wake Lock manager (`src/lib/wakeLock.ts`) with auto-reacquire on visibility change

### Phase 4: Visual Form Motion Engine & Form Coach
- [x] Build animated SVG motion components for the 6 screenshot exercises:
  1. **Bodyweight Squats**: Hip hinge, knees tracking over toes, thighs parallel to floor
  2. **Push-Ups**: Rigid head-to-heel line, chest to floor + knee regression toggle
  3. **Reverse Lunges**: Stepping backward, alternating legs, upright posture
  4. **Glute Bridges**: Hip thrust from floor, glute squeeze at top
  5. **Forearm Plank**: Forearm hold, flat back, engaged core
  6. **Burpees vs Mountain Climbers**: Dynamic switchable animation with high-energy pacing
- [x] Add Muscle Target Pill Badges (Quads, Glutes, Core, Chest, Shoulders, Triceps, etc.)
- [x] Add **Live Form Coaching Cues & Injury Prevention Badges** during active 40s work intervals:
  - High-visibility Do's & Common Mistakes Callout (e.g., "✅ Chest tall", "⚠️ Don't let lower back sag")
  - Expandable **"Form Masterclass" Modal/Card** for each exercise with step-by-step technique, regressions, and the pro-tip: *"Focus on Form over Speed: Controlled tension builds muscle faster than sloppy rushed reps"*
- [x] Add One-Tap Easier Modification (Regression) toggle (e.g., switch to Knee Push-Ups or Step-back Lunges mid-workout if fatigued)

### Phase 5: Interval Workout Timer & State Machine
- [x] Develop deterministic interval timer engine (timestamp delta-based to prevent mobile drift)
- [x] Implement state machine: `IDLE` -> `COUNTDOWN` -> `WORK (40s)` -> `REST (20s)` -> `ROUND_BREAK (60s)` -> `FINISHED`
- [x] Build Circular SVG Progress Ring with animated pulse
- [x] Build "Up Next" preview card that displays during the 20-second rest interval
- [x] Build sticky mobile action bar: Pause / Resume, Skip, Back, Sound Mute, Voice Coach Toggle

### Phase 6: Authentication, History & Custom Builder
- [ ] Next.js API routes for Auth (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`)
- [ ] Next.js API routes for Sessions (`/api/workouts`, `/api/routines`)
- [ ] Post-workout celebration summary card with stats: Total time, rounds finished, estimated calories
- [ ] History & Streak dashboard: View previous sessions and workout consistency
- [ ] Routine Customizer: Edit work/rest/round durations or swap exercise order

### Phase 7: Verification, Mobile Polish & AGENTS.md
- [ ] Run `npm run build` and eliminate any TypeScript or build errors
- [ ] Verify Mobile viewport responsiveness and touch ergonomics (375px - 430px)
- [ ] Generate comprehensive `AGENTS.md` in repository root for future maintenance
- [ ] Verify cloud MongoDB sync and offline fallback behavior
