"use client";

import React from "react";
import { Exercise } from "@/types";

interface VisualExerciseGuideProps {
  exercise: Exercise;
  isAlternative?: boolean;
  isRegression?: boolean;
}

export const VisualExerciseGuide: React.FC<VisualExerciseGuideProps> = ({
  exercise,
  isAlternative = false,
  isRegression = false,
}) => {
  const hasAlternativeVisual = Boolean(isAlternative && exercise.alternative && exercise.alternative.visualKey);
  const activeVisualKey = hasAlternativeVisual
    ? exercise.alternative?.visualKey
    : exercise.visualKey;

  return (
    <div className="relative w-full aspect-[16/10] max-h-[220px] rounded-2xl bg-gradient-to-b from-[#0F1624] to-[#0A0E18] border border-[#1E2B42] p-3 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Dynamic Animated Motion SVG */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {activeVisualKey === "squats" && <AthleticSquat isRegression={isRegression} />}
        {activeVisualKey === "pushups" && <AthleticPushup isRegression={isRegression} />}
        {activeVisualKey === "lunges" && <AthleticLunge isRegression={isRegression} />}
        {activeVisualKey === "bridges" && <AthleticBridge isRegression={isRegression} />}
        {activeVisualKey === "plank" && <AthleticPlank isRegression={isRegression} />}
        {activeVisualKey === "burpees" && <AthleticBurpee isRegression={isRegression} />}
        {activeVisualKey === "mountain-climbers" && <AthleticClimber />}
      </div>

      {/* Target Status Badges */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] pointer-events-none">
        <span className="font-display font-bold text-orange-500 uppercase tracking-widest text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded border border-orange-500/30">
          {isRegression ? "REGRESSION PROTOCOL" : isAlternative ? "ALTERNATIVE MOVE" : "STANDARD TARGET"}
        </span>
        <span className="text-slate-400 font-mono text-[9px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
          LIVE SILHOUETTE
        </span>
      </div>
    </div>
  );
};

// 1. ATHLETIC SQUAT SILHOUETTE
const AthleticSquat: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 240 180" className="w-full h-full max-h-[175px]">
    <defs>
      <linearGradient id="athleteBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6A00" />
        <stop offset="100%" stopColor="#FF9500" />
      </linearGradient>
      <linearGradient id="muscleGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>

    {/* Metric Floor Grid */}
    <line x1="20" y1="155" x2="220" y2="155" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />
    
    {isRegression && (
      <rect x="50" y="105" width="40" height="50" rx="3" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
    )}

    {/* Moving Athlete Figure */}
    <g className="animate-[squatMotion_2.6s_ease-in-out_infinite]">
      {/* Head & Neck */}
      <circle cx="120" cy="32" r="11" fill="url(#athleteBody)" />
      
      {/* Athletic Torso (Broad shoulders, tapered waist) */}
      <path d="M 105 45 Q 120 44 135 45 L 128 92 Q 120 94 112 92 Z" fill="url(#athleteBody)" />

      {/* Front Arms (Extended forward for athletic counterbalance) */}
      <path d="M 112 50 L 158 52 L 156 58 L 112 56 Z" fill="#CBD5E1" />

      {/* Muscular Thighs (Active tension zone) */}
      <path d="M 112 92 L 95 118 Q 98 123 105 120 L 125 94 Z" fill="url(#muscleGlow)" />
      
      {/* Calves & Athletic Feet */}
      <path d="M 98 120 L 100 155 L 120 155 L 105 120 Z" fill="url(#athleteBody)" />
    </g>

    {/* Target Angle Guide */}
    <path d="M 160 115 L 135 115" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2" />
    <text x="165" y="118" fill="#10B981" fontSize="10" fontFamily="var(--font-oswald)" fontWeight="bold" letterSpacing="0.05em">
      PARALLEL DEPTH 90°
    </text>

    <style jsx>{`
      @keyframes squatMotion {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(26px);
        }
      }
    `}</style>
  </svg>
);

// 2. ATHLETIC PUSH-UP SILHOUETTE
const AthleticPushup: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 240 140" className="w-full h-full max-h-[145px]">
    <defs>
      <linearGradient id="chestBurn" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF6A00" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Floor */}
    <line x1="15" y1="120" x2="225" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

    {/* Moving Athlete Figure */}
    <g className="animate-[pushupMotion_2.4s_ease-in-out_infinite] origin-[70px_120px]">
      {/* Head */}
      <circle cx="185" cy="52" r="10" fill="#FF6A00" />

      {/* Rigid Athletic Plank Line (Torso, Glutes, Legs) */}
      <path d="M 178 60 L 68 118 L 65 123 L 175 66 Z" fill="url(#chestBurn)" />

      {/* Athletic Arms (Pressing Floor) */}
      <path d="M 165 68 L 160 120 L 168 120 L 173 68 Z" fill="#E2E8F0" />

      {/* Knee support dot if in regression mode */}
      {isRegression && (
        <circle cx="108" cy="120" r="5" fill="#F59E0B" />
      )}
    </g>

    {/* Alignment Laser */}
    <line x1="60" y1="124" x2="195" y2="52" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    <text x="100" y="32" fill="#10B981" fontSize="10" fontFamily="var(--font-oswald)" fontWeight="bold" letterSpacing="0.05em">
      {isRegression ? "KNEE PIVOT // CORE BRACED" : "RIGID HEAD-TO-HEELS AXIS"}
    </text>

    <style jsx>{`
      @keyframes pushupMotion {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(22px);
        }
      }
    `}</style>
  </svg>
);

// 3. ATHLETIC REVERSE LUNGE SILHOUETTE
const AthleticLunge: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 240 180" className="w-full h-full max-h-[175px]">
    {/* Floor */}
    <line x1="20" y1="155" x2="220" y2="155" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

    <g className="animate-[lungeMotion_2.6s_ease-in-out_infinite]">
      {/* Head & Upright Torso */}
      <circle cx="120" cy="38" r="10" fill="#FF6A00" />
      <path d="M 112 49 Q 120 48 128 49 L 126 95 L 114 95 Z" fill="#FF6A00" />

      {/* Front Driving Leg (90 degree plant) */}
      <path d="M 124 95 L 152 118 L 152 155 L 142 155 L 142 122 L 118 100 Z" fill="#10B981" />

      {/* Back Stepping Leg (Descending toward floor) */}
      <path d="M 116 95 L 75 120 L 70 152 L 62 152 L 66 116 L 110 95 Z" fill="#FF7A00" opacity={isRegression ? "0.75" : "1"} />
    </g>

    <text x="50" y="28" fill="#10B981" fontSize="10" fontFamily="var(--font-oswald)" fontWeight="bold" letterSpacing="0.05em">
      VERTICAL SPINE // 90° STRIDE
    </text>

    <style jsx>{`
      @keyframes lungeMotion {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(18px);
        }
      }
    `}</style>
  </svg>
);

// 4. ATHLETIC GLUTE BRIDGE SILHOUETTE
const AthleticBridge: React.FC<{ isRegression?: boolean }> = () => (
  <svg viewBox="0 0 240 140" className="w-full h-full max-h-[145px]">
    {/* Floor */}
    <line x1="15" y1="120" x2="225" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

    {/* Head & Upper Back Flat on Floor */}
    <circle cx="55" cy="110" r="10" fill="#FF6A00" />
    <rect x="55" y="115" width="35" height="7" rx="3" fill="#64748B" />

    {/* Dynamic Athletic Pelvis & Glute Drive */}
    <g className="animate-[bridgeMotion_2.4s_ease-in-out_infinite]">
      {/* Torso Rising into Bridge */}
      <path d="M 85 120 L 135 78 Q 140 82 135 88 L 90 120 Z" fill="#FF6A00" />
      {/* Muscular Thighs (Glute squeeze target) */}
      <path d="M 135 78 L 175 102 L 168 108 L 132 85 Z" fill="#10B981" />
      {/* Shins Planted Firmly on Floor */}
      <path d="M 175 102 L 175 120 L 165 120 L 165 105 Z" fill="#CBD5E1" />
    </g>

    <text x="105" y="45" fill="#10B981" fontSize="10" fontFamily="var(--font-oswald)" fontWeight="bold" letterSpacing="0.05em">
      PEAK HIP EXTENSION // GLUTE LOCKOUT
    </text>

    <style jsx>{`
      @keyframes bridgeMotion {
        0%, 100% {
          transform: translateY(18px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
    `}</style>
  </svg>
);

// 5. ATHLETIC FOREARM PLANK SILHOUETTE
const AthleticPlank: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 240 140" className="w-full h-full max-h-[145px]">
    {/* Floor */}
    <line x1="15" y1="120" x2="225" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

    {/* Head */}
    <circle cx="185" cy="80" r="10" fill="#FF6A00" />
    
    {/* Forearms Anchored to Ground */}
    <path d="M 165 90 L 165 120 L 190 120 L 190 115 L 173 115 L 173 90 Z" fill="#E2E8F0" />

    {/* Rigid Athletic Plank Torso */}
    <path d="M 165 90 L 65 114 L 62 120 L 162 96 Z" fill="#FF7A00" />

    {/* Core Stability Pulse Arc */}
    <circle cx="118" cy="102" r="10" fill="#10B981" opacity="0.2" className="animate-ping" />
    <circle cx="118" cy="102" r="5" fill="#10B981" />

    {/* Feet / Knee */}
    {isRegression ? (
      <circle cx="108" cy="120" r="5" fill="#F59E0B" />
    ) : (
      <rect x="58" y="115" width="10" height="7" rx="2" fill="#CBD5E1" />
    )}

    <text x="75" y="45" fill="#10B981" fontSize="10" fontFamily="var(--font-oswald)" fontWeight="bold" letterSpacing="0.05em">
      RIGID ANTERIOR BRACE // ZERO HIP SAG
    </text>
  </svg>
);

// 6. ATHLETIC BURPEE SILHOUETTE
const AthleticBurpee: React.FC<{ isRegression?: boolean }> = () => (
  <svg viewBox="0 0 240 180" className="w-full h-full max-h-[175px]">
    {/* Floor */}
    <line x1="15" y1="155" x2="225" y2="155" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

    {/* High-Impact Dynamic Athlete */}
    <g className="animate-[burpeeCycle_3.2s_ease-in-out_infinite]">
      <circle cx="120" cy="45" r="11" fill="#FF6A00" />
      {/* Torso */}
      <path d="M 112 56 L 128 56 L 124 105 L 116 105 Z" fill="#FF6A00" />
      {/* Explosive Overhead Reach */}
      <path d="M 112 60 L 92 25 L 100 22 L 118 58 Z" fill="#10B981" />
      <path d="M 128 60 L 148 25 L 140 22 L 122 58 Z" fill="#10B981" />
      {/* Athletic Legs */}
      <path d="M 116 105 L 105 155 L 115 155 L 122 105 Z" fill="#FF7A00" />
      <path d="M 124 105 L 135 155 L 125 155 L 118 105 Z" fill="#FF7A00" />
    </g>

    <text x="65" y="25" fill="#FF6A00" fontSize="10" fontFamily="var(--font-oswald)" fontWeight="bold" letterSpacing="0.05em">
      PLANK ➔ TUCK ➔ EXPLOSIVE JUMP
    </text>

    <style jsx>{`
      @keyframes burpeeCycle {
        0%, 100% {
          transform: translateY(0);
        }
        35% {
          transform: translateY(42px) scale(0.85);
        }
        70% {
          transform: translateY(-20px);
        }
      }
    `}</style>
  </svg>
);

// 7. ATHLETIC MOUNTAIN CLIMBER SILHOUETTE
const AthleticClimber: React.FC = () => (
  <svg viewBox="0 0 240 140" className="w-full h-full max-h-[145px]">
    {/* Floor */}
    <line x1="15" y1="120" x2="225" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

    {/* Plank Arms */}
    <circle cx="190" cy="62" r="10" fill="#FF6A00" />
    <path d="M 175 72 L 175 120 L 183 120 L 183 72 Z" fill="#E2E8F0" />
    
    {/* Torso Line */}
    <path d="M 175 72 L 80 95 L 77 102 L 172 79 Z" fill="#FF7A00" />

    {/* Back Planted Leg */}
    <path d="M 80 95 L 45 120 L 55 120 L 85 98 Z" fill="#64748B" />

    {/* High-Speed Driving Knee */}
    <g className="animate-[climbSprint_0.8s_ease-in-out_infinite]">
      <path d="M 85 95 L 138 90 L 125 115 L 118 112 L 128 94 L 85 97 Z" fill="#10B981" />
    </g>

    <text x="75" y="38" fill="#10B981" fontSize="10" fontFamily="var(--font-oswald)" fontWeight="bold" letterSpacing="0.05em">
      HORIZONTAL SPRINT // LEVEL HIPS
    </text>

    <style jsx>{`
      @keyframes climbSprint {
        0%, 100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(20px);
        }
      }
    `}</style>
  </svg>
);
