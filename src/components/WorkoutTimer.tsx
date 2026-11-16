"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Routine, TimerPhase, WorkoutSession } from "@/types";
import { audioEngine } from "@/lib/audioEngine";
import { voiceCoach } from "@/lib/voiceCoach";
import { wakeLockManager } from "@/lib/wakeLock";
import { saveLocalSession } from "@/lib/offlineQueue";
import { VisualExerciseGuide } from "./VisualExerciseGuide";
import { FormCoachCard } from "./FormCoachCard";
import { UpNextCard } from "./UpNextCard";
import { formatTime } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  X,
  Award,
  Coffee,
  CheckCircle,
  Zap,
} from "lucide-react";

interface WorkoutTimerProps {
  routine: Routine;
  onExit: () => void;
  onComplete?: (session: WorkoutSession) => void;
  initialSoundEnabled?: boolean;
  initialVoiceEnabled?: boolean;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  routine,
  onExit,
  onComplete,
  initialSoundEnabled = false,
  initialVoiceEnabled = false,
}) => {
  // State Machine
  const [phase, setPhase] = useState<TimerPhase>("get-ready");
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3); // 3s get-ready
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Audio & Hardware Settings (Muted/OFF by default)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialSoundEnabled);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(initialVoiceEnabled);

  // Exercise Customization in current session
  const [useAlternative, setUseAlternative] = useState<boolean>(false);
  const [useRegression, setUseRegression] = useState<boolean>(false);

  const currentExercise = routine.exercises[currentExerciseIndex];
  const nextExercise =
    currentExerciseIndex + 1 < routine.exercises.length
      ? routine.exercises[currentExerciseIndex + 1]
      : routine.exercises[0];

  useEffect(() => {
    wakeLockManager.request();
    return () => {
      wakeLockManager.release();
    };
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    if (nextState) {
      audioEngine.unlock();
      audioEngine.playStartChime(true);
    }
    setSoundEnabled(nextState);
  };

  const toggleVoice = () => {
    const nextState = !voiceEnabled;
    if (nextState) {
      voiceCoach.unlock();
      voiceCoach.speak("Voice coach enabled", true);
    }
    setVoiceEnabled(nextState);
  };

  const transitionToNextPhase = useCallback(() => {
    if (phase === "get-ready") {
      setPhase("work");
      setSecondsRemaining(routine.workDurationSeconds);
      audioEngine.playStartChime(soundEnabled);
      const activeName = useAlternative && currentExercise.alternative
        ? currentExercise.alternative.name
        : currentExercise.name;
      voiceCoach.speak(`Round ${currentRound}. Begin ${activeName}`, voiceEnabled);
    } else if (phase === "work") {
      const isLastExerciseInRound = currentExerciseIndex === routine.exercises.length - 1;
      const isLastRound = currentRound === routine.totalRounds;

      if (isLastExerciseInRound && isLastRound) {
        setPhase("completed");
        audioEngine.playRoundComplete(soundEnabled);
        voiceCoach.speak("Workout complete! Outstanding effort.", voiceEnabled);

        const newSession: WorkoutSession = {
          id: `sess_${Date.now()}`,
          routineTitle: routine.title,
          startedAt: new Date(Date.now() - (totalSecondsElapsed + 1) * 1000).toISOString(),
          completedAt: new Date().toISOString(),
          totalSeconds: totalSecondsElapsed + 1,
          completedRounds: routine.totalRounds,
          completedExercises: routine.exercises.length * routine.totalRounds,
          estimatedCalories: Math.round(((totalSecondsElapsed + 1) / 60) * 11.5),
          syncedToCloud: false,
        };
        saveLocalSession(newSession);
        if (onComplete) onComplete(newSession);
      } else if (isLastExerciseInRound) {
        setPhase("round-break");
        setSecondsRemaining(routine.roundBreakDurationSeconds);
        audioEngine.playRestTone(soundEnabled);
        voiceCoach.speak(
          `Round ${currentRound} complete! Take a 60 second break. Next up is ${routine.exercises[0].name}`,
          voiceEnabled
        );
      } else {
        setPhase("rest");
        setSecondsRemaining(routine.restDurationSeconds);
        audioEngine.playRestTone(soundEnabled);
        voiceCoach.speak(`Rest! Up next: ${nextExercise.name}`, voiceEnabled);
      }
    } else if (phase === "rest") {
      setPhase("work");
      setCurrentExerciseIndex((prev) => prev + 1);
      setSecondsRemaining(routine.workDurationSeconds);
      setUseAlternative(false);
      setUseRegression(false);
      audioEngine.playStartChime(soundEnabled);
      voiceCoach.speak(`Begin ${nextExercise.name}`, voiceEnabled);
    } else if (phase === "round-break") {
      setPhase("work");
      setCurrentRound((prev) => prev + 1);
      setCurrentExerciseIndex(0);
      setSecondsRemaining(routine.workDurationSeconds);
      setUseAlternative(false);
      setUseRegression(false);
      audioEngine.playStartChime(soundEnabled);
      voiceCoach.speak(`Round ${currentRound + 1}. Begin ${routine.exercises[0].name}`, voiceEnabled);
    }
  }, [
    phase,
    currentExerciseIndex,
    currentRound,
    currentExercise,
    nextExercise,
    routine,
    soundEnabled,
    voiceEnabled,
    useAlternative,
    totalSecondsElapsed,
    onComplete,
  ]);

  // Main 1-second interval state machine loop
  useEffect(() => {
    if (!isRunning || phase === "completed") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTotalSecondsElapsed((prev) => prev + 1);

      setSecondsRemaining((prev) => {
        if (prev <= 4 && prev > 1) {
          audioEngine.playCountdownTick(soundEnabled);
        }

        if (prev <= 1) {
          transitionToNextPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase, transitionToNextPhase, soundEnabled]);

  const handleSkipForward = () => {
    transitionToNextPhase();
  };

  const handleSkipBack = () => {
    if (phase === "work") {
      setSecondsRemaining(routine.workDurationSeconds);
    } else if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setPhase("work");
      setSecondsRemaining(routine.workDurationSeconds);
    }
  };

  const totalPhaseDuration =
    phase === "work"
      ? routine.workDurationSeconds
      : phase === "rest"
      ? routine.restDurationSeconds
      : phase === "round-break"
      ? routine.roundBreakDurationSeconds
      : 3;
  const progressRatio = Math.max(0, Math.min(1, secondsRemaining / totalPhaseDuration));
  const strokeDashoffset = 283 * (1 - progressRatio);

  const phaseColors = {
    "get-ready": "text-amber-500 stroke-amber-500",
    work: "text-orange-500 stroke-orange-500",
    rest: "text-emerald-500 stroke-emerald-500",
    "round-break": "text-blue-500 stroke-blue-500",
    completed: "text-emerald-500 stroke-emerald-500",
    idle: "text-slate-500 stroke-slate-500",
  }[phase];

  return (
    <div className="fixed inset-0 z-50 bg-[#080B11] text-[#F8FAFC] flex flex-col justify-between overflow-y-auto [scrollbar-gutter:stable] select-none w-full min-h-screen">
      {/* 1. FULL-WIDTH TOP TACTICAL HUD BAR */}
      <header className="w-full border-b border-[#1E2B42] bg-[#0A0E18]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between w-full">
          {/* Round Badge & Elapsed Timer */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E2B42] text-xs md:text-sm font-display font-bold tracking-wider flex items-center gap-2 uppercase">
              <Zap className="w-4 h-4 text-orange-500 fill-current" />
              <span>
                ROUND {currentRound} / {routine.totalRounds}
              </span>
            </div>

            <span className="text-sm font-mono font-bold text-slate-400">
              {formatTime(totalSecondsElapsed)}
            </span>
          </div>

          {/* Desktop Breadcrumbs Sequence (All 6 Exercises in Current Round) */}
          <div className="hidden lg:flex items-center gap-2">
            {routine.exercises.map((ex, i) => (
              <span
                key={ex.id}
                className={`px-2.5 py-1 rounded text-[11px] font-display font-bold uppercase tracking-wider transition-all ${
                  i === currentExerciseIndex && phase !== "completed"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : i < currentExerciseIndex
                    ? "text-emerald-500/80 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-slate-500 bg-[#0F1624] border border-[#1E2B42]"
                }`}
              >
                0{i + 1} {ex.name.split(" ")[0]}
              </span>
            ))}
          </div>

          {/* Audio Controls & Exit */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-500"
                  : "bg-[#0F1624] border-[#1E2B42] text-slate-500 hover:border-emerald-500/30"
              }`}
              title={soundEnabled ? "Audio: ON" : "Audio: OFF"}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            <button
              onClick={toggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                voiceEnabled
                  ? "bg-orange-500/15 border-orange-500 text-orange-500"
                  : "bg-[#0F1624] border-[#1E2B42] text-slate-500 hover:border-orange-500/30"
              }`}
              title={voiceEnabled ? "Voice: ON" : "Voice: OFF"}
              aria-label="Toggle Voice Coach"
            >
              {voiceEnabled ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            <button
              onClick={onExit}
              className="p-2.5 rounded-xl bg-[#0F1624] border border-[#1E2B42] text-slate-400 hover:text-red-400 transition-colors"
              title="Exit Workout"
              aria-label="Exit Workout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. FULL-WIDTH RESPONSIVE MAIN INTERVAL DISPLAY */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex flex-col justify-center">
        {phase === "completed" ? (
          /* WORKOUT COMPLETED CELEBRATION */
          <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center gap-6 py-8 animate-fade-in bg-[#0F1624] border border-[#1E2B42] rounded-3xl p-8 shadow-2xl">
            <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/20">
              <Award className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-wide text-white uppercase">
                CIRCUIT COMPLETE
              </h2>
              <p className="text-sm md:text-base text-slate-400 mt-2 max-w-md">
                Outstanding discipline! You crushed all {routine.totalRounds} rounds of the protocol.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full my-2">
              <div className="p-4 rounded-2xl bg-[#080B11] border border-[#1E2B42]">
                <span className="block text-2xl md:text-4xl font-display font-black text-orange-500">
                  {formatTime(totalSecondsElapsed)}
                </span>
                <span className="text-[10px] md:text-xs font-display font-bold uppercase text-slate-500 tracking-wider">
                  TIME
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080B11] border border-[#1E2B42]">
                <span className="block text-2xl md:text-4xl font-display font-black text-emerald-500">
                  {routine.totalRounds}
                </span>
                <span className="text-[10px] md:text-xs font-display font-bold uppercase text-slate-500 tracking-wider">
                  ROUNDS
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080B11] border border-[#1E2B42]">
                <span className="block text-2xl md:text-4xl font-display font-black text-blue-500">
                  ~{Math.round(((totalSecondsElapsed) / 60) * 11.5)}
                </span>
                <span className="text-[10px] md:text-xs font-display font-bold uppercase text-slate-500 tracking-wider">
                  CALORIES
                </span>
              </div>
            </div>

            <button
              onClick={onExit}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-display font-black tracking-wider text-base md:text-lg flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-transform"
            >
              <CheckCircle className="w-5 h-5" />
              <span>LOG SESSION & RETURN TO DASHBOARD</span>
            </button>
          </div>
        ) : (
          /* ACTIVE INTERVAL HUD: Split Grid on Desktop, Stacked on Mobile */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT STAGE (5 COLS): Circular Countdown Timer & Desktop Controller Bar */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
              {/* Tactical Interval Banner */}
              <div
                className={`px-5 py-2 rounded-lg text-xs md:text-sm font-display font-bold uppercase tracking-widest border transition-all ${
                  phase === "work"
                    ? "bg-orange-500/15 border-orange-500 text-orange-500 animate-pulse shadow-lg shadow-orange-500/10"
                    : phase === "rest"
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/10"
                    : phase === "round-break"
                    ? "bg-blue-500/15 border-blue-500 text-blue-500"
                    : "bg-amber-500/15 border-amber-500 text-amber-500"
                }`}
              >
                {phase === "get-ready"
                  ? "GET READY // 3 SECONDS"
                  : phase === "work"
                  ? `WORK INTERVAL // ${routine.workDurationSeconds}S`
                  : phase === "rest"
                  ? `RECOVERY INTERVAL // ${routine.restDurationSeconds}S`
                  : `ROUND ${currentRound} BREAK // 60S`}
              </div>

              {/* Giant Circular Digital Bezel */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 flex items-center justify-center my-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="stroke-[#162033]"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className={`transition-all duration-300 ${phaseColors}`}
                    strokeWidth="6"
                    strokeDasharray="283"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Huge High-Impact Oswald Numerals */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-8xl sm:text-9xl font-display font-black tracking-tight text-white leading-none">
                    {secondsRemaining}
                  </span>
                  <span className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 mt-1">
                    SECONDS
                  </span>
                </div>
              </div>

              {/* Tactical Controller Bar for Desktop/Laptop */}
              <div className="w-full max-w-sm hidden md:flex items-center justify-between gap-3 mt-2">
                <button
                  onClick={handleSkipBack}
                  className="w-14 h-14 rounded-xl bg-[#0F1624] border border-[#1E2B42] flex items-center justify-center text-slate-300 active:scale-95 transition-transform hover:border-orange-500/40"
                  title="Previous Exercise / Restart Interval"
                  aria-label="Previous Exercise"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 h-14 rounded-xl font-display font-bold tracking-wider text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform ${
                    isRunning
                      ? "bg-amber-500/15 border border-amber-500 text-amber-400"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>RESUME</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSkipForward}
                  className="w-14 h-14 rounded-xl bg-[#0F1624] border border-[#1E2B42] flex items-center justify-center text-slate-300 active:scale-95 transition-transform hover:border-orange-500/40"
                  title="Skip to Next Interval"
                  aria-label="Skip Forward"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* RIGHT STAGE (7 COLS): Dynamic Movement Guide & Live Form Coach / UpNext */}
            <div className="lg:col-span-7 w-full flex flex-col gap-4">
              {phase === "rest" || phase === "round-break" ? (
                <div className="w-full">
                  {phase === "round-break" ? (
                    <div className="p-8 rounded-3xl bg-[#0F1624] border border-blue-500/30 text-center flex flex-col items-center gap-4 shadow-xl">
                      <Coffee className="w-12 h-12 text-blue-500" />
                      <h3 className="text-2xl md:text-3xl font-display font-black tracking-wide text-white uppercase">
                        ROUND {currentRound} RECOVERY
                      </h3>
                      <p className="text-sm md:text-base text-slate-300 max-w-md leading-relaxed">
                        Rehydrate, steady your breathing, and lower your heart rate. Round {currentRound + 1} begins with{" "}
                        <span className="font-bold text-orange-500">
                          {routine.exercises[0].name}
                        </span>
                        .
                      </p>
                    </div>
                  ) : (
                    <UpNextCard nextExercise={nextExercise} secondsRemaining={secondsRemaining} />
                  )}
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  <VisualExerciseGuide
                    exercise={currentExercise}
                    isAlternative={useAlternative}
                    isRegression={useRegression}
                  />

                  <FormCoachCard
                    exercise={currentExercise}
                    isAlternative={useAlternative}
                    onToggleAlternative={() => setUseAlternative(!useAlternative)}
                    isRegression={useRegression}
                    onToggleRegression={() => setUseRegression(!useRegression)}
                    isCompact={false}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile-Only Bottom Sticky Controller Bar */}
      {phase !== "completed" && (
        <footer className="sticky bottom-0 pt-3 pb-3 bg-[#080B11] border-t border-[#1E2B42] flex md:hidden items-center justify-between gap-3 px-4">
          <button
            onClick={handleSkipBack}
            className="w-14 h-14 rounded-xl bg-[#0F1624] border border-[#1E2B42] flex items-center justify-center text-slate-300 active:scale-95 transition-transform hover:border-orange-500/40"
            title="Previous Exercise / Restart Interval"
            aria-label="Previous Exercise"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 h-14 rounded-xl font-display font-bold tracking-wider text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform ${
              isRunning
                ? "bg-amber-500/15 border border-amber-500 text-amber-400"
                : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>RESUME</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkipForward}
            className="w-14 h-14 rounded-xl bg-[#0F1624] border border-[#1E2B42] flex items-center justify-center text-slate-300 active:scale-95 transition-transform hover:border-orange-500/40"
            title="Skip to Next Interval"
            aria-label="Skip Forward"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </footer>
      )}
    </div>
  );
};
