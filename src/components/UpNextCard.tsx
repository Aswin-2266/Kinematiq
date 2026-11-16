"use client";

import React from "react";
import { Exercise } from "@/types";
import { VisualExerciseGuide } from "./VisualExerciseGuide";
import { ArrowRight, Clock } from "lucide-react";

interface UpNextCardProps {
  nextExercise: Exercise;
  secondsRemaining: number;
}

export const UpNextCard: React.FC<UpNextCardProps> = ({
  nextExercise,
  secondsRemaining,
}) => {
  return (
    <div className="w-full flex flex-col gap-3 rounded-2xl bg-[#0F1624] border border-emerald-500/30 p-4 shadow-xl animate-fade-in">
      {/* Rest Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-display font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>RECOVERY // UP NEXT</span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-display font-black text-emerald-400 leading-none">
            {secondsRemaining}s
          </span>
          <span className="text-[9px] block font-display font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            GET IN POSITION
          </span>
        </div>
      </div>

      {/* Upcoming Exercise Name & Instruction */}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-display font-black text-white tracking-wide uppercase">
            {nextExercise.name}
          </h3>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
          {nextExercise.instructions}
        </p>
      </div>

      {/* Visual Guide Preview */}
      <div className="w-full overflow-hidden rounded-xl border border-[#1E2B42]">
        <VisualExerciseGuide exercise={nextExercise} />
      </div>

      {/* Target Muscles */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {nextExercise.targetMuscles.map((muscle) => (
          <span
            key={muscle}
            className="text-[10px] font-display font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#162033] text-emerald-400 border border-emerald-500/20"
          >
            {muscle}
          </span>
        ))}
      </div>
    </div>
  );
};
