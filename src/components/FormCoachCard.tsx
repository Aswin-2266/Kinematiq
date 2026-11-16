"use client";

import React, { useState } from "react";
import { Exercise } from "@/types";
import { CheckCircle2, AlertTriangle, ArrowRightLeft, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

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
    <div className="w-full flex flex-col gap-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 shadow-sm transition-all">
      {/* Header with Title and Switches */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
              Form Coach
            </span>
            {isRegression && (
              <span className="text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                Regression Active
              </span>
            )}
          </div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">
            {activeName}
          </h3>
        </div>

        {/* Quick Toggles: Alternative (e.g. Mountain Climbers) or Regression (e.g. Knee Pushups) */}
        <div className="flex items-center gap-1">
          {exercise.alternative && (
            <button
              onClick={onToggleAlternative}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isAlternative
                  ? "bg-orange-500/15 border-orange-500 text-orange-500"
                  : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-orange-500/40"
              }`}
              title="Switch between Burpees and Mountain Climbers"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="text-[11px]">
                {isAlternative ? "Burpees" : exercise.alternative.name.split(" ")[0]}
              </span>
            </button>
          )}

          {exercise.regression && (
            <button
              onClick={onToggleRegression}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRegression
                  ? "bg-amber-500/15 border-amber-500 text-amber-500"
                  : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-amber-500/40"
              }`}
              title="Toggle easier variation if fatigued"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px]">{isRegression ? "Standard" : "Easier"}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
            className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
          >
            {muscle}
          </span>
        ))}
      </div>

      {/* Primary Instruction Line */}
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
        &ldquo;{activeInstructions}&rdquo;
      </p>

      {/* Expandable Deep Coaching Section */}
      {isExpanded && (
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[var(--border-subtle)] animate-fade-in">
          {/* Key Form Checkpoints */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Critical Checkpoints
            </span>
            <div className="grid grid-cols-1 gap-1">
              {activeCues.map((cue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-primary)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Injury Prevention / Common Mistakes Callout */}
          {activeWarning && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[11px] uppercase tracking-wide">
                  Avoid Injury:
                </span>
                <span>{activeWarning}</span>
              </div>
            </div>
          )}

          {/* Pro-Tip Box from Screenshot */}
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[11px]">Pro-Tip:</span>
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
