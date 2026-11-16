"use client";

import React, { useState } from "react";
import { Exercise } from "@/types";
import { CheckCircle2, AlertTriangle, ArrowRightLeft, ShieldAlert, Zap, ChevronDown, ChevronUp } from "lucide-react";

interface FormCoachCardProps {
  exercise: Exercise;
  isAlternative: boolean;
  onToggleAlternative: () => void;
  isRegression: boolean;
  onToggleRegression: () => void;
  isCompact?: boolean;
}

export const FormCoachCard: React.FC<FormCoachCardProps> = ({
  exercise,
  isAlternative,
  onToggleAlternative,
  isRegression,
  onToggleRegression,
  isCompact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCompact);

  const activeName = isAlternative && exercise.alternative
    ? exercise.alternative.name
    : isRegression && exercise.regression
    ? exercise.regression.name
    : exercise.name;

  const activeMuscles = isAlternative && exercise.alternative
    ? exercise.alternative.targetMuscles
    : exercise.targetMuscles;

  const activeInstructions = isAlternative && exercise.alternative
    ? exercise.alternative.instructions
    : isRegression && exercise.regression
    ? exercise.regression.instructions
    : exercise.instructions;

  const activeCues = isAlternative && exercise.alternative
    ? exercise.alternative.formCues
    : exercise.formCues;

  const activeWarning = isAlternative && exercise.alternative
    ? exercise.alternative.watchOutWarning
    : exercise.watchOutWarning;

  return (
    <div className="w-full flex flex-col gap-2.5 rounded-2xl bg-[#0F1624] border border-[#1E2B42] p-4 shadow-md transition-all">
      {/* Header with Title and Switches */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-orange-500">
              FORM CUE & TARGET
            </span>
            {isRegression && (
              <span className="text-[9px] font-display font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase">
                REGRESSION
              </span>
            )}
          </div>
          <h3 className="text-lg font-display font-bold text-white tracking-wide uppercase">
            {activeName}
          </h3>
        </div>

        {/* Quick Toggles: Alternative or Regression */}
        <div className="flex items-center gap-1">
          {exercise.alternative && (
            <button
              onClick={onToggleAlternative}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-display font-bold tracking-wider flex items-center gap-1.5 transition-all ${
                isAlternative
                  ? "bg-orange-500/20 border-orange-500 text-orange-400"
                  : "bg-[#162033] border-[#1E2B42] text-slate-300 hover:border-orange-500/40"
              }`}
              title="Switch between Burpees and Mountain Climbers"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>
                {isAlternative ? "BURPEES" : exercise.alternative.name.split(" ")[0].toUpperCase()}
              </span>
            </button>
          )}

          {exercise.regression && (
            <button
              onClick={onToggleRegression}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-display font-bold tracking-wider flex items-center gap-1.5 transition-all ${
                isRegression
                  ? "bg-amber-500/20 border-amber-500 text-amber-400"
                  : "bg-[#162033] border-[#1E2B42] text-slate-300 hover:border-amber-500/40"
              }`}
              title="Toggle easier variation"
            >
              <Zap className="w-3 h-3" />
              <span>{isRegression ? "STANDARD" : "EASIER"}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Target Muscle Badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {activeMuscles.map((muscle) => (
          <span
            key={muscle}
            className="text-[10px] font-display font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#162033] text-slate-300 border border-[#1E2B42]"
          >
            {muscle}
          </span>
        ))}
      </div>

      {/* Primary Instruction Line */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans">
        {activeInstructions}
      </p>

      {/* Expandable Deep Coaching Section */}
      {isExpanded && (
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#1E2B42] animate-fade-in">
          {/* Key Form Checkpoints */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-400">
              TECHNIQUE CHECKPOINTS
            </span>
            <div className="grid grid-cols-1 gap-1">
              {activeCues.map((cue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Injury Prevention Warning */}
          {activeWarning && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-display font-bold block text-[11px] uppercase tracking-wider">
                  AVOID INJURY:
                </span>
                <span>{activeWarning}</span>
              </div>
            </div>
          )}

          {/* Pro-Tip Box */}
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-display font-bold block text-[11px] uppercase tracking-wider">
                PRO-TIP:
              </span>
              <span>
                Focus on form over speed. Controlled repetitions build muscle faster than sloppy, rushed reps.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
