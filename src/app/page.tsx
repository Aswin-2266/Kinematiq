"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Flame, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  ShieldAlert, 
  Smartphone, 
  Play, 
  ChevronRight,
  Sparkles,
  Award,
  History
} from "lucide-react";
import { DEFAULT_ROUTINE } from "@/data/defaultRoutine";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { getLocalSessions, syncPendingSessions } from "@/lib/offlineQueue";
import { WorkoutSession } from "@/types";
import { formatTime } from "@/lib/utils";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [soundEnabled, setSoundEnabled] = useState(false); // Default OFF as requested
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Default OFF as requested
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    // Sync theme class to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // Load local history on mount & attempt cloud sync
    const local = getLocalSessions();
    setSessions(local);
    syncPendingSessions().then((res) => {
      if (res.syncedCount > 0) {
        setSessions(getLocalSessions());
      }
    });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleWorkoutComplete = (session: WorkoutSession) => {
    setSessions((prev) => [session, ...prev]);
    setIsWorkingOut(false);
    // Background cloud sync attempt
    syncPendingSessions();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-4 md:p-8 max-w-md mx-auto transition-colors duration-200">
      {/* Top Mobile Bar */}
      <header className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Kinematiq
            </h1>
            <p className="text-[11px] font-medium text-orange-500 tracking-wider uppercase">
              Circuit Trainer
            </p>
          </div>
        </div>

        {/* Global Control Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle (Default OFF) */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)]"
            }`}
            title={soundEnabled ? "Audio Sound: ON" : "Audio Sound: OFF (Tap to enable)"}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Coach Toggle (Default OFF) */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2.5 rounded-xl border transition-all ${
              voiceEnabled
                ? "bg-orange-500/10 border-orange-500 text-orange-500"
                : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)]"
            }`}
            title={voiceEnabled ? "Voice Coach: ON" : "Voice Coach: OFF (Tap to enable)"}
            aria-label="Toggle Voice Coach"
          >
            {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-orange-500/40 transition-all"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-5 flex flex-col gap-5">
        {/* Hero Circuit Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-6 shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Search Recommended Circuit</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)] mb-2">
            {DEFAULT_ROUTINE.title}
          </h2>

          <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
            {DEFAULT_ROUTINE.description}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-3">
            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center">
              <span className="block text-xl font-extrabold text-orange-500">40s</span>
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase">Work</span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center">
              <span className="block text-xl font-extrabold text-emerald-500">20s</span>
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase">Rest</span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center">
              <span className="block text-xl font-extrabold text-blue-500">3</span>
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase">Rounds</span>
            </div>
          </div>

          {/* Pro-Tip Quote from Screenshot */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs leading-relaxed flex items-start gap-2.5 mt-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Focus on Form over Speed:</span>
              Controlled repetitions with proper tension build muscle faster than sloppy, rushed reps.
            </div>
          </div>
        </div>

        {/* Exercises Preview List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              6 Exercises in Circuit
            </h3>
            <span className="text-xs text-orange-500 font-semibold">18 Mins Total</span>
          </div>

          <div className="flex flex-col gap-2">
            {DEFAULT_ROUTINE.exercises.map((ex, idx) => (
              <div
                key={ex.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs text-[var(--text-secondary)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">
                      {ex.name}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      {ex.targetMuscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-medium"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Previous Workouts / History Section */}
        {sessions.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Recent Workouts</span>
              </h3>
              <span className="text-xs text-emerald-500 font-semibold">
                {sessions.length} Logged
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {sessions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-[var(--text-primary)]">
                        {s.routineTitle}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {new Date(s.completedAt).toLocaleDateString()} • {formatTime(s.totalSeconds)}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-orange-500">
                    ~{s.estimatedCalories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Mobile Start Action */}
      <footer className="sticky bottom-0 pt-3 pb-2 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent">
        <button
          onClick={() => setIsWorkingOut(true)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-transform"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START WORKOUT (3 ROUNDS)</span>
        </button>
        <p className="text-[11px] text-center text-[var(--text-muted)] mt-2 flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Screen stays awake automatically during workout</span>
        </p>
      </footer>

      {/* Live Fullscreen Workout Timer Modal */}
      {isWorkingOut && (
        <WorkoutTimer
          routine={DEFAULT_ROUTINE}
          onExit={() => setIsWorkingOut(false)}
          onComplete={handleWorkoutComplete}
          initialSoundEnabled={soundEnabled}
          initialVoiceEnabled={voiceEnabled}
        />
      )}
    </div>
  );
}
