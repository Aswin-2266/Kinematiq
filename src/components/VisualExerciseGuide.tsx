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
  const activeVisualKey = isAlternative && exercise.alternative
    ? exercise.alternative.visualKey
    : exercise.visualKey;

  return (
    <div className="relative w-full aspect-[16/10] max-h-[220px] rounded-2xl bg-gradient-to-b from-[var(--bg-surface-elevated)] to-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 flex flex-col items-center justify-center overflow-hidden shadow-inner">
      {/* Background Grid & Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff5e1e0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Dynamic Animated Motion SVG */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {activeVisualKey === "squats" && <SquatAnimation isRegression={isRegression} />}
        {activeVisualKey === "pushups" && <PushupAnimation isRegression={isRegression} />}
        {activeVisualKey === "lunges" && <LungeAnimation isRegression={isRegression} />}
        {activeVisualKey === "bridges" && <BridgeAnimation isRegression={isRegression} />}
        {activeVisualKey === "plank" && <PlankAnimation isRegression={isRegression} />}
        {activeVisualKey === "burpees" && <BurpeeAnimation isRegression={isRegression} />}
        {activeVisualKey === "mountain-climbers" && <MountainClimberAnimation />}
      </div>

      {/* Target Muscles Pill Overlay */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] pointer-events-none">
        <span className="font-semibold text-orange-500 uppercase tracking-wider text-[10px] bg-[var(--bg-primary)]/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-orange-500/20">
          {isRegression ? "Regression Mode" : isAlternative ? "Alternative" : "Standard Form"}
        </span>
        <span className="text-[var(--text-muted)] text-[10px] bg-[var(--bg-primary)]/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
          Looping Guide
        </span>
      </div>
    </div>
  );
};

// 1. SQUAT ANIMATION
const SquatAnimation: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 200 160" className="w-full h-full max-h-[160px]">
    <defs>
      <linearGradient id="squatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5E1E" />
        <stop offset="100%" stopColor="#FF9500" />
      </linearGradient>
    </defs>
    {/* Ground Line */}
    <line x1="20" y1="140" x2="180" y2="140" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-slate-600/40" />

    {/* Chair/Box outline if in regression mode */}
    {isRegression && (
      <rect x="55" y="90" width="30" height="50" rx="4" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
    )}

    {/* Animated Body */}
    <g className="animate-[squatMotion_2.4s_ease-in-out_infinite]">
      {/* Head */}
      <circle cx="100" cy="30" r="10" fill="url(#squatGrad)" />
      {/* Torso */}
      <line x1="100" y1="40" x2="100" y2="85" stroke="url(#squatGrad)" strokeWidth="6" strokeLinecap="round" />
      {/* Arms extended for balance */}
      <line x1="100" y1="52" x2="135" y2="52" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      {/* Thighs / Hips */}
      <line x1="100" y1="85" x2="85" y2="108" stroke="url(#squatGrad)" strokeWidth="6" strokeLinecap="round" />
      {/* Shin / Feet */}
      <line x1="85" y1="108" x2="88" y2="140" stroke="url(#squatGrad)" strokeWidth="6" strokeLinecap="round" />
      <line x1="88" y1="140" x2="105" y2="140" stroke="#FF5E1E" strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Form Guideline text */}
    <text x="145" y="98" fill="#10B981" fontSize="9" fontWeight="bold">90° Thighs</text>
    <path d="M 140 96 L 115 96" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2" />

    <style jsx>{`
      @keyframes squatMotion {
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

// 2. PUSH-UP ANIMATION
const PushupAnimation: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 220 130" className="w-full h-full max-h-[150px]">
    <defs>
      <linearGradient id="pushupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5E1E" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>
    {/* Ground Line */}
    <line x1="15" y1="110" x2="205" y2="110" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-slate-600/40" />

    {/* Head & Body */}
    <g className="animate-[pushupMotion_2.2s_ease-in-out_infinite] origin-[60px_110px]">
      {/* Head */}
      <circle cx="165" cy="45" r="9" fill="#FF5E1E" />
      {/* Straight Line Torso / Spine */}
      <line x1="158" y1="52" x2="60" y2="110" stroke="url(#pushupGrad)" strokeWidth="6" strokeLinecap="round" />
      {/* Arms (Chest to floor) */}
      <line x1="145" y1="60" x2="145" y2="110" stroke="#FF5E1E" strokeWidth="5" strokeLinecap="round" />
      {/* Knee support dot if regression */}
      {isRegression && (
        <circle cx="95" cy="110" r="5" fill="#F59E0B" />
      )}
    </g>

    <text x="110" y="30" fill="#10B981" fontSize="9" fontWeight="bold">
      {isRegression ? "Knee Pivot Line" : "Straight Line Head-to-Heels"}
    </text>

    <style jsx>{`
      @keyframes pushupMotion {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(20px);
        }
      }
    `}</style>
  </svg>
);

// 3. REVERSE LUNGE ANIMATION
const LungeAnimation: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 200 160" className="w-full h-full max-h-[160px]">
    {/* Floor */}
    <line x1="20" y1="140" x2="180" y2="140" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-slate-600/40" />

    <g className="animate-[lungeMotion_2.5s_ease-in-out_infinite]">
      {/* Head & Upright Torso */}
      <circle cx="100" cy="35" r="9" fill="#FF5E1E" />
      <line x1="100" y1="44" x2="100" y2="85" stroke="#FF5E1E" strokeWidth="6" strokeLinecap="round" />

      {/* Front Leg (90 degree bend) */}
      <line x1="100" y1="85" x2="125" y2="105" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
      <line x1="125" y1="105" x2="125" y2="140" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />

      {/* Back Leg (Stepping back toward floor) */}
      <line x1="100" y1="85" x2="65" y2="110" stroke="#FF7A00" strokeWidth="5" strokeLinecap="round" />
      <line x1="65" y1="110" x2="60" y2={isRegression ? "125" : "138"} stroke="#FF7A00" strokeWidth="5" strokeLinecap="round" />
    </g>

    <text x="35" y="25" fill="#10B981" fontSize="9" fontWeight="bold">Torso Tall & Upright</text>

    <style jsx>{`
      @keyframes lungeMotion {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(16px);
        }
      }
    `}</style>
  </svg>
);

// 4. GLUTE BRIDGE ANIMATION
const BridgeAnimation: React.FC<{ isRegression?: boolean }> = () => (
  <svg viewBox="0 0 220 130" className="w-full h-full max-h-[150px]">
    {/* Floor */}
    <line x1="15" y1="110" x2="205" y2="110" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-slate-600/40" />

    {/* Head resting on floor */}
    <circle cx="50" cy="100" r="9" fill="#FF5E1E" />
    <line x1="50" y1="108" x2="80" y2="108" stroke="#FF5E1E" strokeWidth="5" strokeLinecap="round" />

    {/* Dynamic Hips and Pelvis */}
    <g className="animate-[bridgeMotion_2.3s_ease-in-out_infinite]">
      {/* Torso lifting */}
      <line x1="80" y1="108" x2="120" y2="70" stroke="#FF5E1E" strokeWidth="6" strokeLinecap="round" />
      {/* Thigh */}
      <line x1="120" y1="70" x2="155" y2="90" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
      {/* Lower Leg to Floor */}
      <line x1="155" y1="90" x2="155" y2="110" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
    </g>

    <text x="100" y="45" fill="#10B981" fontSize="9" fontWeight="bold">Squeeze Glutes at Peak</text>

    <style jsx>{`
      @keyframes bridgeMotion {
        0%, 100% {
          transform: translateY(18px);
        }
        50% {
          transform: translateY(-6px);
        }
      }
    `}</style>
  </svg>
);

// 5. FOREARM PLANK ANIMATION
const PlankAnimation: React.FC<{ isRegression?: boolean }> = ({ isRegression }) => (
  <svg viewBox="0 0 220 130" className="w-full h-full max-h-[150px]">
    {/* Floor */}
    <line x1="15" y1="110" x2="205" y2="110" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-slate-600/40" />

    {/* Head */}
    <circle cx="165" cy="72" r="9" fill="#FF5E1E" />
    {/* Forearm on floor */}
    <line x1="145" y1="80" x2="145" y2="110" stroke="#FF5E1E" strokeWidth="5" strokeLinecap="round" />
    <line x1="145" y1="110" x2="165" y2="110" stroke="#FF5E1E" strokeWidth="5" strokeLinecap="round" />

    {/* Rigid Torso */}
    <line x1="145" y1="80" x2="55" y2="105" stroke="#FF7A00" strokeWidth="6" strokeLinecap="round" />

    {/* Feet / Knee */}
    {isRegression ? (
      <circle cx="95" cy="110" r="5" fill="#F59E0B" />
    ) : (
      <line x1="55" y1="105" x2="52" y2="110" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
    )}

    {/* Core Tension Pulse Circle */}
    <circle cx="105" cy="92" r="8" fill="#10B981" opacity="0.3" className="animate-ping" />
    <circle cx="105" cy="92" r="4" fill="#10B981" />

    <text x="80" y="45" fill="#10B981" fontSize="9" fontWeight="bold">Brace Abs & Glutes Tight</text>
  </svg>
);

// 6. BURPEE ANIMATION
const BurpeeAnimation: React.FC<{ isRegression?: boolean }> = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full max-h-[160px]">
    {/* Floor */}
    <line x1="15" y1="140" x2="185" y2="140" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-slate-600/40" />

    {/* Multi-phase dynamic movement */}
    <g className="animate-[burpeeCycle_3s_ease-in-out_infinite]">
      {/* Head */}
      <circle cx="100" cy="40" r="9" fill="#FF5E1E" />
      {/* Body */}
      <line x1="100" y1="49" x2="100" y2="90" stroke="#FF5E1E" strokeWidth="6" strokeLinecap="round" />
      {/* Arms up for jump */}
      <line x1="100" y1="55" x2="120" y2="25" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="55" x2="80" y2="25" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      {/* Legs */}
      <line x1="100" y1="90" x2="90" y2="135" stroke="#FF7A00" strokeWidth="5" strokeLinecap="round" />
      <line x1="100" y1="90" x2="110" y2="135" stroke="#FF7A00" strokeWidth="5" strokeLinecap="round" />
    </g>

    <text x="50" y="20" fill="#FF5E1E" fontSize="9" fontWeight="bold">Plank ➔ Jump ➔ Reach</text>

    <style jsx>{`
      @keyframes burpeeCycle {
        0%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(35px) scale(0.9);
        }
        60% {
          transform: translateY(-15px);
        }
      }
    `}</style>
  </svg>
);

// 7. MOUNTAIN CLIMBERS ANIMATION
const MountainClimberAnimation: React.FC = () => (
  <svg viewBox="0 0 220 130" className="w-full h-full max-h-[150px]">
    {/* Floor */}
    <line x1="15" y1="110" x2="205" y2="110" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-slate-600/40" />

    {/* Plank Arms */}
    <line x1="155" y1="65" x2="155" y2="110" stroke="#FF5E1E" strokeWidth="5" strokeLinecap="round" />
    <circle cx="170" cy="55" r="9" fill="#FF5E1E" />
    {/* Torso */}
    <line x1="155" y1="65" x2="70" y2="85" stroke="#FF7A00" strokeWidth="6" strokeLinecap="round" />

    {/* Back Leg planted */}
    <line x1="70" y1="85" x2="45" y2="110" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />

    {/* Front Driving Knee */}
    <g className="animate-[climbSprint_0.8s_ease-in-out_infinite]">
      <line x1="70" y1="85" x2="120" y2="82" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
      <line x1="120" y1="82" x2="110" y2="105" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
    </g>

    <text x="65" y="35" fill="#10B981" fontSize="9" fontWeight="bold">Rapid Knee Drives</text>

    <style jsx>{`
      @keyframes climbSprint {
        0%, 100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(18px);
        }
      }
    `}</style>
  </svg>
);
