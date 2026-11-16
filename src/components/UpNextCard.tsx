"use client";

import React from "react";
import { Exercise } from "@/types";
import { VisualExerciseGuide } from "./VisualExerciseGuide";
import { ArrowRight, Sparkles } from "lucide-react";

interface UpNextCardProps {
  nextExercise: Exercise;
  secondsRemaining: number;
}

export const UpNextCard: React.FC<UpNextCardProps> = ({
  nextExercise,
  secondsRemaining,
}) => {
  return (
    <div className="w-full flex flex-col gap-3 rounded-3xl bg-[var(--bg-surface)] border-2 border-emerald-500/30 p-4 shadow-xl animate-fade-in">
      {/* Rest Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rest Period — Up Next</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-500 font-mono">
            {secondsRemaining}s
          </span>
          <span className="text-[10px] block font-semibold text-[var(--text-muted)] uppercase">
            Get in position
          </span>
        </div>
      </div>

      {/* Upcoming Exercise Name & Instruction */}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black text-[var(--text-primary)]">
            {nextExercise.name}
          </h3>
          <ArrowRight className="w-4 h-4 text-emerald-500" />
        </div>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
          {nextExercise.instructions}
        </p>
      </div>

      {/* Visual Guide Preview */}
      <div className="w-full overflow-hidden rounded-xl border border-[var(--border-subtle)]">
        <VisualExerciseGuide exercise={nextExercise} />
      </div>

      {/* Target Muscles */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {nextExercise.targetMuscles.map((muscle) => (
          <span
            key={muscle}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          >
            {muscle}
          </span>
        ))}
      </div>
    </div>
  );
};
