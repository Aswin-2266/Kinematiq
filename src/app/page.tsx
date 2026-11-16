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
  Award, 
  History, 
  Sliders, 
  User as UserIcon, 
  CheckCircle2,
  Zap,
  Target
} from "lucide-react";
import { DEFAULT_ROUTINE } from "@/data/defaultRoutine";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { AuthModal } from "@/components/AuthModal";
import { RoutineEditor } from "@/components/RoutineEditor";
import { getLocalSessions, syncPendingSessions } from "@/lib/offlineQueue";
import { WorkoutSession, Routine, User } from "@/types";
import { formatTime } from "@/lib/utils";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [soundEnabled, setSoundEnabled] = useState(false); // Default OFF as requested
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Default OFF as requested
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [routine, setRoutine] = useState<Routine>(DEFAULT_ROUTINE);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem("kinematiq_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        // Ignore
      }
    }

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
    syncPendingSessions();
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    syncPendingSessions().then(() => {
      setSessions(getLocalSessions());
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("kinematiq_token");
    localStorage.removeItem("kinematiq_user");
    setCurrentUser(null);
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-4 md:p-8 max-w-md mx-auto transition-colors duration-150 [scrollbar-gutter:stable]">
      {/* Tactical Top Bar */}
      <header className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black tracking-wider uppercase text-[var(--text-primary)] leading-none">
              KINEMATIQ
            </h1>
            <p className="text-[10px] font-display font-bold text-orange-500 tracking-widest uppercase mt-0.5">
              INTERVAL PROTOCOL
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
                ? "bg-emerald-500/15 border-emerald-500 text-emerald-500"
                : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-orange-500/30"
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
                ? "bg-orange-500/15 border-orange-500 text-orange-500"
                : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-orange-500/30"
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

          {/* User Account / Profile */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className={`p-2.5 rounded-xl border transition-all ${
              currentUser
                ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-display font-bold text-xs"
                : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-orange-500/40"
            }`}
            title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In to sync with MongoDB"}
            aria-label="Account Settings"
          >
            {currentUser ? (
              <span className="w-4 h-4 flex items-center justify-center font-black">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-5 flex flex-col gap-5">
        {/* Hero Circuit Card with Direct START Button */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-6 shadow-2xl">
          {/* Tactical Badge & Customize Link */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[11px] font-display font-bold uppercase tracking-widest">
              <Target className="w-3.5 h-3.5" />
              <span>PROTOCOL // FULL-BODY</span>
            </div>

            <button
              onClick={() => setIsEditorOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>CUSTOMIZE</span>
            </button>
          </div>

          <h2 className="text-3xl font-display font-black tracking-wide text-[var(--text-primary)] mb-1 uppercase">
            {routine.title}
          </h2>

          <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed font-sans">
            {routine.description}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-3">
            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center">
              <span className="block text-2xl font-display font-black text-orange-500">
                {routine.workDurationSeconds}S
              </span>
              <span className="text-[10px] font-display font-bold text-[var(--text-muted)] uppercase tracking-wider">
                WORK
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center">
              <span className="block text-2xl font-display font-black text-emerald-500">
                {routine.restDurationSeconds}S
              </span>
              <span className="text-[10px] font-display font-bold text-[var(--text-muted)] uppercase tracking-wider">
                REST
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center">
              <span className="block text-2xl font-display font-black text-blue-500">
                {routine.totalRounds}
              </span>
              <span className="text-[10px] font-display font-bold text-[var(--text-muted)] uppercase tracking-wider">
                ROUNDS
              </span>
            </div>
          </div>

          {/* DIRECT START WORKOUT CTA INSIDE HERO CARD */}
          <button
            onClick={() => setIsWorkingOut(true)}
            className="w-full py-4 mt-2 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-display font-black tracking-wider text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/30 active:scale-[0.98] transition-transform hover:brightness-105"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>START WORKOUT ({routine.totalRounds} ROUNDS)</span>
          </button>

          {/* Pro-Tip Quote */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs leading-relaxed flex items-start gap-2.5 mt-3.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <span className="font-display font-bold uppercase tracking-wider block mb-0.5">
                FOCUS ON FORM OVER SPEED:
              </span>
              <span className="text-[11px] text-slate-300">
                Controlled repetitions with proper tension build muscle faster than sloppy, rushed reps.
              </span>
            </div>
          </div>
        </div>

        {/* Exercises Preview List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-display font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {routine.exercises.length} EXERCISES IN CIRCUIT
            </h3>
            <span className="text-xs font-display font-bold text-orange-500 tracking-wider">
              ~{Math.round(((routine.workDurationSeconds + routine.restDurationSeconds) * routine.exercises.length * routine.totalRounds) / 60)} MINS TOTAL
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {routine.exercises.map((ex, idx) => (
              <div
                key={ex.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-display font-bold text-xs text-orange-500">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-wide">
                      {ex.name}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      {ex.targetMuscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="text-[10px] font-display font-medium px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] uppercase"
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
              <h3 className="text-xs font-display font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>WORKOUT HISTORY</span>
              </h3>
              <span className="text-xs font-display font-bold text-emerald-500 tracking-wider">
                {sessions.length} COMPLETED
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {sessions.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm block text-[var(--text-primary)] uppercase tracking-wide">
                        {s.routineTitle}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {new Date(s.completedAt).toLocaleDateString()} • {formatTime(s.totalSeconds)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-bold text-sm text-orange-500 block">
                      ~{s.estimatedCalories} KCAL
                    </span>
                    <span className="text-[9px] text-emerald-500 flex items-center justify-end gap-0.5 font-display font-semibold uppercase">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      SAVED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Screen Wake Lock Footer Badge */}
      <footer className="pt-2 pb-1 text-center">
        <p className="text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 font-sans">
          <Smartphone className="w-3.5 h-3.5 text-orange-500" />
          <span>Screen wake lock active: display remains awake during training</span>
        </p>
      </footer>

      {/* Live Fullscreen Workout Timer Modal */}
      {isWorkingOut && (
        <WorkoutTimer
          routine={routine}
          onExit={() => setIsWorkingOut(false)}
          onComplete={handleWorkoutComplete}
          initialSoundEnabled={soundEnabled}
          initialVoiceEnabled={voiceEnabled}
        />
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          onLogout={handleLogout}
        />
      )}

      {/* Routine Customizer Modal */}
      {isEditorOpen && (
        <RoutineEditor
          currentRoutine={routine}
          onClose={() => setIsEditorOpen(false)}
          onSave={(updated) => setRoutine(updated)}
        />
      )}
    </div>
  );
}
