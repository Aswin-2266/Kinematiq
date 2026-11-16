# Kinematiq ⚡
> **Mobile-First High-Intensity Interval Circuit Trainer & Form Coach**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20Ready-green?logo=mongodb)](https://www.mongodb.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-orange?logo=pwa)](https://web.dev/progressive-web-apps/)

**Kinematiq** is a Progressive Web App (PWA) tailored for bodyweight interval training. Based on the gold-standard **"15–20 Minute Full-Body Circuit"**, it guides you through **40 seconds of high-intensity work** followed by **20 seconds of rest** across 3 full rounds, complete with visual animated exercise references, real-time voice and audio coaching, Screen Wake Lock integration, and cloud data persistence in MongoDB Atlas.

---

## 🌟 Key Features

- **Built-in Animated Visual Guides**: Animated vector movement diagrams for all 6 core exercises (*Bodyweight Squats, Push-Ups, Reverse Lunges, Glute Bridges, Forearm Plank, and Burpees/Mountain Climbers*).
- **Form Coach & Injury Prevention**: Live posture checkpoints and common mistake warnings (*"Avoid lower back sagging"*, *"Knees tracking in line with toes"*) displayed during active work intervals.
- **1-Tap Regressions**: Easily drop to Knee Push-Ups or Step-Backs mid-workout if fatigued without pausing the timer clock.
- **Audio & Voice Coach**:
  - Procedural Web Audio API gym chimes (880Hz start chime, 440Hz rest tone, 587Hz 3-2-1 ticks).
  - Web Speech API announcements (*"Rest for 20 seconds. Next up: Push-Ups"*).
  - **Muted/OFF by default** for quiet gym environments, with high-visibility one-tap toggles to enable.
- **Screen Wake Lock API**: Keeps your mobile phone screen awake during planks, glute bridges, and floor exercises.
- **Offline Resilience & MongoDB Cloud Sync**: Workouts save instantly to local browser storage even with zero internet or restricted firewalls, and automatically synchronize to MongoDB Atlas when online.
- **Kinetic Pulse Color Psychology**: High-contrast Fiery Coral (`#FF5E1E`) and Emerald (`#10B981`) with seamless Light Mode and Dark Mode toggling.
- **PWA Ready**: Add to Home Screen on iOS Safari and Android Chrome for a native, fullscreen mobile experience.

---

## 📋 The 15–20 Minute Circuit

| # | Exercise | Target Muscles | Default Work / Rest | Coaching Cue |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Bodyweight Squats** | Quads, Glutes, Core | 40s Work / 20s Rest | *Keep chest up and sink hips back until thighs are parallel to floor.* |
| **2** | **Push-Ups** | Chest, Shoulders, Triceps, Core | 40s Work / 20s Rest | *Maintain a straight line from head to heels; drop to knees if needed.* |
| **3** | **Reverse Lunges** | Quads, Hamstrings, Glutes, Balance | 40s Work / 20s Rest | *Step backward and lower back knee gently toward floor, alternating legs.* |
| **4** | **Glute Bridges** | Glutes, Hamstrings, Lower Back | 40s Work / 20s Rest | *Lie on back, bend knees with feet flat, drive hips up hard, squeezing glutes.* |
| **5** | **Forearm Plank** | Deep Core, Shoulders | 40s Work / 20s Rest | *Hold a rigid straight-line plank on forearms, bracing abs and glutes tightly.* |
| **6** | **Burpees or Mountain Climbers** | Cardio & Full-Body Burn | 40s Work / 60s Round Break | *Move at a steady, high-energy pace for the full 40 seconds to finish out the round.* |

*Complete 3 full rounds with a 1-minute rest between rounds.*

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Aswin-2266/Kinematiq.git
cd Kinematiq
npm install
```

### 2. Configure Environment
Create a `.env.local` file:
```env
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kinematiq?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

---

## 📱 Mobile Installation (PWA)

1. Open your deployed URL on your phone:
   - **iOS Safari**: Tap the Share button $\rightarrow$ Select **"Add to Home Screen"**.
   - **Android Chrome**: Tap the three-dot menu $\rightarrow$ Select **"Install App"** or **"Add to Home Screen"**.
2. Kinematiq will launch fullscreen like a native mobile app without browser address bars!

---

## 🧭 Project Documentation
- **[spec.md](spec.md)**: Master progress chart and milestone tracking.
- **[AGENTS.md](AGENTS.md)**: Complete architecture manual and operational guide for AI agents and developers.
- **[FUTURE_PLANS.md](FUTURE_PLANS.md)**: Multi-stage progression roadmap (Stage 1 Beginner regressions $\rightarrow$ Stage 2 Intermediate preset $\rightarrow$ Stage 3 Advanced power), dynamic level unlocking, and wearable integrations.
