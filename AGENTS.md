# AGENTS.md — Kinematiq Project Blueprint & Operating Manual

> **Product**: Kinematiq  
> **Repository**: [https://github.com/Aswin-2266/Kinematiq.git](https://github.com/Aswin-2266/Kinematiq.git)  
> **Domain**: Mobile-First Interval Circuit & Bodyweight Training Progressive Web App (PWA)

---

## 1. Project Vision & Identity

Kinematiq is a mobile-first workout web application built for high-intensity interval training (HIIT), bodyweight circuits, and Tabata pacing. It is specifically designed around the gold-standard **"15–20 Minute Full-Body Circuit"**:

### Core Exercises
1. **Bodyweight Squats** (Quads, Glutes, Core) — *Keep chest up and sink hips back until thighs are parallel to the floor.*
2. **Push-Ups** (Chest, Shoulders, Triceps, Core) — *Maintain a straight line from head to heels; drop to knees if needed.*
3. **Reverse Lunges** (Quads, Hamstrings, Glutes, Balance) — *Step backward and lower back knee gently toward floor, alternating legs.*
4. **Glute Bridges** (Glutes, Hamstrings, Lower Back) — *Lie on back, bend knees with feet flat, and drive hips up hard, squeezing glutes at top.*
5. **Forearm Plank** (Deep Core, Shoulders) — *Hold a rigid straight-line plank on forearms, bracing abs and glutes tightly.*
6. **Burpees or Mountain Climbers** (Cardio & Full-Body Burn) — *Move at a steady, high-energy pace for the full 40 seconds to finish out the round.*

### Circuit Pacing Structure
- **Work Interval**: 40 seconds
- **Rest Interval**: 20 seconds (with "Up Next" visual & audio preview)
- **Round Break**: 60 seconds (after exercise #6)
- **Rounds**: 3 full rounds (~18–20 minutes total workout duration)

---

## 2. Technical Stack & Architectural Decisions

- **Framework**: Next.js 14+ (App Router, React 18, TypeScript).
- **Styling**: Tailwind CSS + CSS Variables implementing the *Kinetic Pulse* color psychology system:
  - **Fiery Coral (`#FF5E1E`) / Sunset Orange (`#FF7A00`)**: High energy, adrenaline, and active work intervals.
  - **Vitality Emerald (`#10B981`)**: Relief, breath, and rest recovery intervals.
  - **Obsidian Black (`#0B0F19`) & Clean Porcelain (`#FAFAFA`)**: High-contrast dark and light modes.
- **Database & ODM**: MongoDB Atlas cloud connection via Mongoose with cached connection pooling and resilient client-side offline storage queue.
- **Audio Synthesizer Engine**: Zero-latency procedural sound generation via standard Web Audio API (no external mp3 files required, works 100% offline).
- **Voice Coach Engine**: Web Speech API (`window.speechSynthesis`) with announcement queue management.
- **Screen Wake Lock**: Standard Screen Wake Lock API (`navigator.wakeLock`) with automatic re-locking on visibility changes.
- **Authentication**: Multi-user JWT authentication with bcrypt password hashing.

---

## 3. Strict Development & Safety Rules for Agents

### Rule 1: Audio Autoplay & Default Mute Policy
- **Audio and Voice Coach MUST remain OFF/MUTED by default**.
- Never auto-play sound on page load without explicit user interaction.
- The user must explicitly tap the Sound or Voice Coach toggle to enable audio; this tap unlocks the browser's `AudioContext` and `speechSynthesis`.

### Rule 2: Mobile Touch Ergonomics
- All interactive controls (buttons, toggles, sliders) must maintain a minimum touch area of **48px × 48px** (ideally 52px+ for workout action buttons) so users with sweaty hands can tap them reliably without looking down closely.

### Rule 3: Resilient Offline-First Data Storage
- If MongoDB Atlas is temporarily unreachable or the network drops during a workout, always save the session locally in `localStorage` via `src/lib/offlineQueue.ts`.
- Auto-sync pending sessions when network connectivity or cloud database access returns.

### Rule 4: Timestamp Delta Timing
- Do not rely solely on simple `setInterval` counters for workout time. Use timestamp deltas or deterministic interval state transitions so mobile browser background tab throttling does not cause timer drift.

### Rule 5: Zero Internal Database ID & Tech Stack Leakage to Frontend UI
- Never render raw database IDs (`_id`, `userId`, `routineId`, session IDs, or cloud sync IDs) to the user in the frontend UI.
- Never expose underlying backend/database tech stack brand names (e.g. MongoDB, Atlas, Mongoose) in frontend UI text.
- All IDs and tech details are strictly internal to API routes, data models, and React keys.
- User-facing interfaces must show clean, human-readable and brand-neutral terms only (e.g. "SYNC ACTIVE", "Cloud Verified", routine titles, elapsed time, and progress badges).


---

## 4. Key Directory & File Map

```
workout-helper/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # Login, Register, Me endpoints
│   │   │   ├── health/         # MongoDB Atlas health check
│   │   │   ├── routines/       # Custom routine creation and retrieval
│   │   │   └── workouts/       # Session logging and history
│   │   ├── globals.css         # Kinetic Pulse color variables and PWA styles
│   │   ├── layout.tsx          # PWA meta tags and viewport safe-area
│   │   └── page.tsx            # Main application shell and workout launcher
│   ├── components/
│   │   ├── AuthModal.tsx       # Sign In, Sign Up, and User Profile modal
│   │   ├── FormCoachCard.tsx   # Live form cues, injury warnings, and regressions
│   │   ├── RoutineEditor.tsx   # Custom work/rest interval builder
│   │   ├── UpNextCard.tsx      # Rest interval preview card
│   │   ├── VisualExerciseGuide.tsx # Animated SVG movement guides
│   │   └── WorkoutTimer.tsx    # State machine interval timer
│   ├── data/
│   │   └── defaultRoutine.ts   # 15-Min Circuit presets & exercise library
│   ├── lib/
│   │   ├── audioEngine.ts      # Web Audio procedural gym chime synthesizer
│   │   ├── auth.ts             # JWT token issuance and bcrypt helpers
│   │   ├── mongodb.ts          # Mongoose cloud connection pool
│   │   ├── offlineQueue.ts     # Client-side storage and cloud sync
│   │   ├── utils.ts            # Formatting and class merging
│   │   ├── voiceCoach.ts       # Web Speech API announcements
│   │   └── wakeLock.ts         # Screen Wake Lock manager
│   └── types/
│       └── index.ts            # Complete TypeScript interface definitions
├── public/
│   └── manifest.json           # PWA standalone manifest
├── FUTURE_PLANS.md             # Multi-stage difficulty progression roadmap
├── spec.md                     # Master progress chart and milestone tracker
└── package.json
```

---

## 5. Standard Verification Commands

```bash
# Verify TypeScript and Next.js production build
npm run build

# Run local development server
npm run dev

# Run linting
npm run lint
```
