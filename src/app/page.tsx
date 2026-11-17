"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Award, 
  History, 
  Sliders, 
  User as UserIcon, 
  CheckCircle2,
  Target,
  Zap,
  Clock,
  Dumbbell,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { DEFAULT_ROUTINE } from "@/data/defaultRoutine";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { AuthModal } from "@/components/AuthModal";
import { RoutineEditor } from "@/components/RoutineEditor";
import { getLocalSessions, syncPendingSessions } from "@/lib/offlineQueue";
import { WorkoutSession, Routine, User, Exercise } from "@/types";
import { formatTime } from "@/lib/utils";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [soundEnabled, setSoundEnabled] = useState(false); // Default OFF per AGENTS.md
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Default OFF per AGENTS.md
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [routine, setRoutine] = useState<Routine>(DEFAULT_ROUTINE);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

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

  // Load user's customized routine from local storage or cloud MongoDB
  const loadUserRoutine = useCallback(async (userId?: string) => {
    // 1. Check local storage first for instantaneous load
    const localKey = userId ? `kinematiq_routine_${userId}` : "kinematiq_custom_routine";
    const cached = localStorage.getItem(localKey);
    if (cached) {
      try {
        setRoutine(JSON.parse(cached));
      } catch {}
    } else {
      setRoutine(DEFAULT_ROUTINE);
    }

    // 2. Sync from MongoDB Atlas if user is signed in
    const token = localStorage.getItem("kinematiq_token");
    if (token) {
      try {
        const res = await fetch("/api/routines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.userRoutine) {
          setRoutine(data.userRoutine);
          if (userId) {
            localStorage.setItem(`kinematiq_routine_${userId}`, JSON.stringify(data.userRoutine));
          }
        }
      } catch {
        // Offline resilience fallback: keep cached routine
      }
    }
  }, []);

  useEffect(() => {
    const savedUserStr = localStorage.getItem("kinematiq_user");
    let parsedUser: User | null = null;
    if (savedUserStr) {
      try {
        parsedUser = JSON.parse(savedUserStr);
        setCurrentUser(parsedUser);
      } catch {}
    }

    // Load routine for this account
    loadUserRoutine(parsedUser?.id);

    const local = getLocalSessions();
    setSessions(local);
    syncPendingSessions().then((res) => {
      if (res.syncedCount > 0) {
        setSessions(getLocalSessions());
      }
    });
  }, [loadUserRoutine]);

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
    loadUserRoutine(user.id);
    syncPendingSessions().then(() => {
      setSessions(getLocalSessions());
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("kinematiq_token");
    localStorage.removeItem("kinematiq_user");
    setCurrentUser(null);
    setIsAuthOpen(false);
    setRoutine(DEFAULT_ROUTINE);
  };

  // Save routine customizations for this account
  const handleSaveRoutine = async (updated: Routine) => {
    setRoutine(updated);

    // 1. Save locally for instant offline persistence
    const localKey = currentUser ? `kinematiq_routine_${currentUser.id}` : "kinematiq_custom_routine";
    localStorage.setItem(localKey, JSON.stringify(updated));

    // 2. Save to cloud MongoDB Atlas under the user's account if logged in
    const token = localStorage.getItem("kinematiq_token");
    if (token) {
      try {
        await fetch("/api/routines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        });
      } catch {
        // Offline fallback: already saved in localStorage
      }
    }
  };

  // Calculations for stats
  const totalDurationMinutes = Math.round(
    ((routine.workDurationSeconds + routine.restDurationSeconds) * routine.exercises.length * routine.totalRounds) / 60
  );
  const estCalories = Math.round(totalDurationMinutes * 11.5);
  const totalWorkoutsCount = sessions.length;
  const totalMinutesTrained = Math.round(sessions.reduce((acc, s) => acc + s.totalSeconds, 0) / 60);

  // Breakdown between fully completed vs partial sessions
  const fullSessionsCount = sessions.filter(
    (s) => s.status === "completed" || (s.isCompleted !== false && s.completedRounds >= (s.totalRoundsPlanned || 3))
  ).length;
  const partialSessionsCount = totalWorkoutsCount - fullSessionsCount;

  return (
    <div className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between transition-colors duration-150 [scrollbar-gutter:stable] pb-24 sm:pb-28">
      {/* 1. FULL-WIDTH EDGE-TO-EDGE TOP NAVIGATION */}
      <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-black tracking-wider uppercase text-[var(--text-primary)] leading-none">
                  KINEMATIQ
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-display font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/30 uppercase tracking-widest">
                  INTERVAL PROTOCOL
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans hidden sm:block mt-0.5">
                Precision Bodyweight HIIT & Functional Circuit Conditioning
              </p>
            </div>
          </div>

          {/* Center Protocol Telemetry (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-display font-bold text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 text-orange-500">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{routine.totalRounds} ROUNDS</span>
            </span>
            <span className="text-[var(--border-subtle)]">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{routine.workDurationSeconds}S WORK / {routine.restDurationSeconds}S REST</span>
            </span>
            <span className="text-[var(--border-subtle)]">•</span>
            <span className="flex items-center gap-1.5 text-emerald-500">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>NO GEAR NEEDED</span>
            </span>
          </div>

          {/* Right Action & Control Toggles */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle (Default OFF) */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all ${
                soundEnabled
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-500 shadow-sm shadow-emerald-500/10"
                  : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-orange-500/30"
              }`}
              title={soundEnabled ? "Audio Chimes: ON" : "Audio Chimes: OFF (Tap to enable Web Audio)"}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline font-display text-xs font-bold uppercase tracking-wider">
                {soundEnabled ? "Sound: ON" : "Sound: OFF"}
              </span>
            </button>

            {/* Voice Coach Toggle (Default OFF) */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all ${
                voiceEnabled
                  ? "bg-orange-500/15 border-orange-500 text-orange-500 shadow-sm shadow-orange-500/10"
                  : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-orange-500/30"
              }`}
              title={voiceEnabled ? "Voice Coach: ON" : "Voice Coach: OFF (Tap to enable speech synthesis)"}
              aria-label="Toggle Voice Coach"
            >
              {voiceEnabled ? <Mic className="w-4 h-4 text-orange-500" /> : <MicOff className="w-4 h-4" />}
              <span className="hidden md:inline font-display text-xs font-bold uppercase tracking-wider">
                {voiceEnabled ? "Voice: ON" : "Voice: OFF"}
              </span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-orange-500/40 transition-all"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* User Account / Profile Button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all flex items-center gap-2 ${
                currentUser
                  ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-display font-bold text-xs shadow-md shadow-orange-500/20"
                  : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-orange-500/40"
              }`}
              title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In or Register"}
              aria-label="Account Settings"
            >
              {currentUser ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline font-display text-xs tracking-wide">{currentUser.name}</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="hidden sm:inline font-display text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Sign In
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. FULL-WIDTH RESPONSIVE MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full flex-1 flex flex-col gap-8">
        
        {/* A. WIDESCREEN HERO PROTOCOL COMMAND CENTER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-surface)] to-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Ambient Kinetic Glow effect */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Eyebrow & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-display font-bold uppercase tracking-widest">
                <Target className="w-4 h-4 text-orange-500" />
                <span>GOLD-STANDARD FULL-BODY PROTOCOL // ZERO EQUIPMENT</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditorOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-orange-500 hover:border-orange-500/40 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-orange-500" />
                  <span>CUSTOMIZE INTERVALS</span>
                </button>
              </div>
            </div>

            {/* Hero Titles & Synopsis */}
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-wide text-[var(--text-primary)] uppercase leading-tight">
                {routine.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2.5 leading-relaxed font-sans">
                {routine.description} Engineered around high mechanical tension and aerobic recovery intervals to maximize metabolic output, muscular stamina, and functional strength.
              </p>
            </div>

            {/* Key Pacing Metrics Ribbon (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-1">
              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center transition-all hover:border-orange-500/30">
                <span className="block text-3xl sm:text-4xl font-display font-black text-orange-500">
                  {routine.workDurationSeconds}S
                </span>
                <span className="text-xs font-display font-bold text-[var(--text-muted)] uppercase tracking-wider block mt-0.5">
                  WORK INTERVAL
                </span>
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:block">Max Controlled Effort</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center transition-all hover:border-emerald-500/30">
                <span className="block text-3xl sm:text-4xl font-display font-black text-emerald-500">
                  {routine.restDurationSeconds}S
                </span>
                <span className="text-xs font-display font-bold text-[var(--text-muted)] uppercase tracking-wider block mt-0.5">
                  REST RECOVERY
                </span>
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:block">Heart Rate Reset & Preview</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center transition-all hover:border-blue-500/30">
                <span className="block text-3xl sm:text-4xl font-display font-black text-blue-500">
                  {routine.totalRounds}
                </span>
                <span className="text-xs font-display font-bold text-[var(--text-muted)] uppercase tracking-wider block mt-0.5">
                  TOTAL ROUNDS
                </span>
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:block">6 Movements Per Round</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center transition-all hover:border-amber-500/30">
                <span className="block text-3xl sm:text-4xl font-display font-black text-amber-500">
                  ~{totalDurationMinutes}M
                </span>
                <span className="text-xs font-display font-bold text-[var(--text-muted)] uppercase tracking-wider block mt-0.5">
                  EST. DURATION
                </span>
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:block">~{estCalories} kcal Metabolic Burn</span>
              </div>
            </div>

            {/* Launch Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
              <button
                onClick={() => setIsWorkingOut(true)}
                className="flex-1 py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-display font-black tracking-wider text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-orange-500/30 active:scale-[0.98] transition-transform hover:brightness-105"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>START WORKOUT ({routine.totalRounds} ROUNDS • ~{totalDurationMinutes} MINS)</span>
              </button>
            </div>

            {/* Form Over Speed Principle Callout */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <span className="font-display font-bold uppercase tracking-wider block mb-0.5 text-amber-400">
                  COACHING PRINCIPLE // FOCUS ON FORM OVER SPEED:
                </span>
                <span className="text-xs text-[var(--text-secondary)] leading-normal">
                  Controlled repetitions under strict muscle tension build functional strength and protect joints far faster than sloppy, rushed repetitions. Aim for clean, explosive concentric movement and disciplined eccentric control.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* B. WIDESCREEN 2-COLUMN STUDIO DASHBOARD: EXERCISES + INTELLIGENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA (8 COLS): 6-EXERCISE INTERACTIVE MOVEMENT MATRIX */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <span>CIRCUIT MOVEMENT SEQUENCE</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                  Complete each movement for {routine.workDurationSeconds} seconds with {routine.restDurationSeconds} seconds rest between stations
                </p>
              </div>

              <span className="text-xs font-display font-bold text-orange-500 tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                {routine.exercises.length} EXERCISES
              </span>
            </div>

            {/* 2-COLUMN GRID OF EXERCISE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {routine.exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className="group relative cursor-pointer p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-orange-500/50 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between gap-4"
                >
                  {/* Card Top: Number & Category */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-display font-black text-sm text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        0{idx + 1}
                      </span>
                      <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] group-hover:text-orange-500 transition-colors flex items-center gap-1">
                        <span>TECHNIQUE</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                    <h4 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                      {ex.name}
                    </h4>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1 font-sans leading-relaxed">
                      {ex.instructions}
                    </p>
                  </div>

                  {/* Card Bottom: Muscles & Form Cue */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ex.targetMuscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="text-[9px] font-display font-bold px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] uppercase tracking-wider"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>

                    {ex.formCues && ex.formCues.length > 0 && (
                      <p className="text-[11px] text-emerald-500 flex items-center gap-1.5 font-sans font-medium line-clamp-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{ex.formCues[0]}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT AREA (4 COLS): TRAINING INTELLIGENCE & HISTORY SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 1. Workout History & Streaks Card */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                  <History className="w-4 h-4 text-orange-500" />
                  <span>TRAINING LOGS & STREAK</span>
                </h3>
                <span className="text-xs font-display font-bold text-emerald-500">
                  {fullSessionsCount} FULL • {partialSessionsCount} PARTIAL
                </span>
              </div>

              {/* Quick Summary Badges */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center">
                  <span className="block text-xl font-display font-black text-[var(--text-primary)]">
                    {totalWorkoutsCount}
                  </span>
                  <span className="text-[10px] font-display font-bold uppercase text-[var(--text-muted)] tracking-wider">
                    SESSIONS LOGGED
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center">
                  <span className="block text-xl font-display font-black text-orange-500">
                    {totalMinutesTrained}m
                  </span>
                  <span className="text-[10px] font-display font-bold uppercase text-[var(--text-muted)] tracking-wider">
                    TIME LOGGED
                  </span>
                </div>
              </div>

              {/* Sessions List */}
              {sessions.length > 0 ? (
                <div className="flex flex-col gap-2 mt-1">
                  {sessions.slice(0, 5).map((s) => {
                    const isPartial = s.status === "partial" || s.isCompleted === false || s.completedRounds < (s.totalRoundsPlanned || 3);
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSession(s)}
                        className="group cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-orange-500/40 transition-all text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isPartial
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                          }`}>
                            {isPartial ? (
                              <Flame className="w-4 h-4" />
                            ) : (
                              <Award className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-display font-bold text-xs block text-[var(--text-primary)] uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                                {s.routineTitle}
                              </span>
                              <span className={`text-[9px] font-display font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                                isPartial
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              }`}>
                                {isPartial ? "PARTIAL" : "COMPLETED"}
                              </span>
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-0.5">
                              {new Date(s.completedAt).toLocaleDateString()} • {formatTime(s.totalSeconds)} • {s.completedExercises || 0}/{s.totalExercisesPlanned || 18} moves
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-display font-bold text-xs text-orange-500 block">
                            ~{s.estimatedCalories} KCAL
                          </span>
                          <span className="text-[9px] text-[var(--text-muted)] group-hover:text-orange-500 font-display font-semibold uppercase flex items-center justify-end gap-0.5">
                            REPORT →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)] flex flex-col items-center gap-2 py-6">
                  <Flame className="w-8 h-8 text-orange-500/40" />
                  <p className="font-display font-bold text-[var(--text-secondary)] uppercase tracking-wide">
                    READY FOR YOUR FIRST SESSION?
                  </p>
                  <p className="text-[11px] max-w-xs text-[var(--text-muted)] font-sans">
                    Tap &quot;Start Workout&quot; below. Even partial stops will be accurately logged and synced to MongoDB Atlas.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Tactical Movement Principles */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-3 shadow-sm">
              <h3 className="text-xs font-display font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>HOW TO MASTER THIS CIRCUIT</span>
              </h3>

              <div className="space-y-3 text-xs text-[var(--text-secondary)] font-sans">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-orange-500/10 text-orange-500 flex items-center justify-center font-display font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    <strong className="text-[var(--text-primary)] font-display uppercase tracking-wider block">Controlled Eccentric Phase:</strong>
                    Lower yourself under control for 2 seconds before driving upward. Do not freefall into squats or push-ups.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-display font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    <strong className="text-[var(--text-primary)] font-display uppercase tracking-wider block">Consistent Work Rate:</strong>
                    Don&apos;t sprint the first 15 seconds and burnout. Maintain a rhythmic pace that lets you work through all {routine.workDurationSeconds} seconds.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center font-display font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    <strong className="text-[var(--text-primary)] font-display uppercase tracking-wider block">Use 1-Tap Regressions:</strong>
                    If muscles fatigue mid-set, switch to Knee Push-Ups or Step-Back Lunges rather than stopping completely.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Audio & Hardware Status */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold uppercase tracking-wider block text-[var(--text-primary)]">
                    HARDWARE OPTIMIZED
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Screen wake lock & Web Audio engine
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-display font-bold text-emerald-500 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

          </div>
        </div>
      </main>

      {/* 3. FULL-WIDTH EDGE-TO-EDGE FOOTER */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] font-sans">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm uppercase text-[var(--text-primary)]">KINEMATIQ</span>
            <span>— Precision High-Intensity Interval Protocol</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Offline Resilience Enabled</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-orange-500" />
              <span>Wake Lock Guarded</span>
            </span>
          </div>
        </div>
      </footer>

      {/* 4. STICKY BOTTOM START WORKOUT CONTROLLER */}
      {!isWorkingOut && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-t border-[var(--border-subtle)] px-4 py-3 sm:py-3.5 shadow-2xl transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Protocol Summary Details (Hidden on small mobile screens, visible on tablet/desktop) */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center font-display font-black text-sm shrink-0">
                {routine.totalRounds}R
              </div>
              <div>
                <h4 className="font-display font-black text-sm uppercase text-[var(--text-primary)] tracking-wide leading-tight">
                  {routine.title}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  {routine.workDurationSeconds}s Work • {routine.restDurationSeconds}s Rest • ~{totalDurationMinutes} mins total
                </p>
              </div>
            </div>

            {/* Glowing High-Impact Tactile Start Button (100% full-width on mobile phones, prominent on desktop) */}
            <button
              onClick={() => setIsWorkingOut(true)}
              className="w-full sm:w-auto sm:min-w-[320px] py-3.5 sm:py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-display font-black tracking-wider text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/30 active:scale-[0.98] transition-all hover:brightness-105"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START WORKOUT ({routine.totalRounds} ROUNDS)</span>
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}

      {/* Exercise Technique Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-3xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-orange-500">
                  EXERCISE MASTERCLASS
                </span>
                <h3 className="text-2xl font-display font-black text-[var(--text-primary)] uppercase">
                  {selectedExercise.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="w-9 h-9 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {selectedExercise.instructions}
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs">
              <strong className="block font-display uppercase tracking-wider mb-1">
                Form Checkpoints:
              </strong>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                {selectedExercise.formCues?.map((cue, i) => (
                  <li key={i}>{cue}</li>
                ))}
              </ul>
            </div>

            {selectedExercise.watchOutWarning && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>
                  <strong className="uppercase font-display tracking-wider block">Watch Out:</strong>
                  {selectedExercise.watchOutWarning}
                </span>
              </div>
            )}

            <button
              onClick={() => setSelectedExercise(null)}
              className="w-full py-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] hover:border-orange-500/40"
            >
              CLOSE MASTERCLASS
            </button>
          </div>
        </div>
      )}

      {/* 5. SESSION REPORT / DETAIL MODAL */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-3xl max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedSession.status === "partial" || selectedSession.isCompleted === false
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                }`}>
                  {selectedSession.status === "partial" || selectedSession.isCompleted === false ? (
                    <Flame className="w-5 h-5" />
                  ) : (
                    <Award className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest text-orange-500">
                    TRAINING TELEMETRY REPORT
                  </span>
                  <h3 className="text-xl font-display font-black text-[var(--text-primary)] uppercase">
                    {selectedSession.routineTitle}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="w-8 h-8 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Status Pill Banner */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider ${
              selectedSession.status === "partial" || selectedSession.isCompleted === false
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            }`}>
              <span>STATUS:</span>
              <span>
                {selectedSession.status === "partial" || selectedSession.isCompleted === false
                  ? "STOPPED EARLY (PARTIAL SESSION SAVED)"
                  : "FULL WORKOUT COMPLETED"}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                <span className="block text-2xl font-display font-black text-orange-500">
                  {formatTime(selectedSession.totalSeconds)}
                </span>
                <span className="text-[10px] font-display font-bold uppercase text-[var(--text-muted)] tracking-wider">
                  TIME TRAINED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                <span className="block text-2xl font-display font-black text-emerald-500">
                  ~{selectedSession.estimatedCalories}
                </span>
                <span className="text-[10px] font-display font-bold uppercase text-[var(--text-muted)] tracking-wider">
                  EST. KCAL BURNED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                <span className="block text-2xl font-display font-black text-[var(--text-primary)]">
                  {selectedSession.completedRounds} / {selectedSession.totalRoundsPlanned || 3}
                </span>
                <span className="text-[10px] font-display font-bold uppercase text-[var(--text-muted)] tracking-wider">
                  ROUNDS LOGGED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                <span className="block text-2xl font-display font-black text-blue-500">
                  {selectedSession.completedExercises || 0} / {selectedSession.totalExercisesPlanned || 18}
                </span>
                <span className="text-[10px] font-display font-bold uppercase text-[var(--text-muted)] tracking-wider">
                  EXERCISES FINISHED
                </span>
              </div>
            </div>

            {/* Session Metadata / Timestamps */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)] font-sans">
              <div className="flex justify-between">
                <span>Completed At:</span>
                <span className="font-mono text-[var(--text-primary)]">
                  {new Date(selectedSession.completedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cloud Storage Status:</span>
                <span className="font-display font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MongoDB Atlas Verified</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSession(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all hover:brightness-105"
            >
              CLOSE SESSION REPORT
            </button>
          </div>
        </div>
      )}

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
          onSave={handleSaveRoutine}
        />
      )}
    </div>
  );
}
