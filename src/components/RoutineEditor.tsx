"use client";

import React, { useState } from "react";
import { Routine } from "@/types";
import { X, Sliders, Check, Clock } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface RoutineEditorProps {
  currentRoutine: Routine;
  onClose: () => void;
  onSave: (updated: Routine) => void;
}

export const RoutineEditor: React.FC<RoutineEditorProps> = ({
  currentRoutine,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(currentRoutine.title);
  const [workDuration, setWorkDuration] = useState(currentRoutine.workDurationSeconds);
  const [restDuration, setRestDuration] = useState(currentRoutine.restDurationSeconds);
  const [roundBreak, setRoundBreak] = useState(currentRoutine.roundBreakDurationSeconds);
  const [rounds, setRounds] = useState(currentRoutine.totalRounds);

  const exerciseCount = currentRoutine.exercises.length;
  const singleRoundSeconds = (workDuration + restDuration) * (exerciseCount - 1) + workDuration;
  const totalSeconds = singleRoundSeconds * rounds + roundBreak * (rounds - 1);

  const handleApply = () => {
    const updated: Routine = {
      ...currentRoutine,
      title,
      workDurationSeconds: workDuration,
      restDurationSeconds: restDuration,
      roundBreakDurationSeconds: roundBreak,
      totalRounds: rounds,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#0F1624] border border-[#1E2B42] p-6 shadow-2xl relative flex flex-col gap-4 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold uppercase tracking-wider text-white">
                CUSTOMIZE INTERVALS
              </h3>
              <p className="text-[11px] text-slate-400">
                Pacing and round progression
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculated Total Time Badge */}
        <div className="p-3.5 rounded-2xl bg-[#162033] border border-[#1E2B42] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-display font-semibold text-slate-300 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>TOTAL TIME:</span>
          </div>
          <span className="text-lg font-display font-black text-orange-500">
            {formatTime(totalSeconds)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Work Duration */}
          <div>
            <div className="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider mb-1.5">
              <span className="text-white">WORK INTERVAL</span>
              <span className="text-orange-500 font-mono">{workDuration}s</span>
            </div>
            <div className="flex items-center gap-2">
              {[30, 40, 45, 60].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setWorkDuration(sec)}
                  className={`flex-1 py-2 rounded-xl text-xs font-display font-bold border transition-all ${
                    workDuration === sec
                      ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-[#162033] border-[#1E2B42] text-slate-300"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Rest Duration */}
          <div>
            <div className="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider mb-1.5">
              <span className="text-white">REST INTERVAL</span>
              <span className="text-emerald-400 font-mono">{restDuration}s</span>
            </div>
            <div className="flex items-center gap-2">
              {[15, 20, 30, 45].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setRestDuration(sec)}
                  className={`flex-1 py-2 rounded-xl text-xs font-display font-bold border transition-all ${
                    restDuration === sec
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25"
                      : "bg-[#162033] border-[#1E2B42] text-slate-300"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Round Break Duration */}
          <div>
            <div className="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider mb-1.5">
              <span className="text-white">ROUND BREAK</span>
              <span className="text-blue-400 font-mono">{roundBreak}s</span>
            </div>
            <div className="flex items-center gap-2">
              {[45, 60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setRoundBreak(sec)}
                  className={`flex-1 py-2 rounded-xl text-xs font-display font-bold border transition-all ${
                    roundBreak === sec
                      ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/25"
                      : "bg-[#162033] border-[#1E2B42] text-slate-300"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Total Rounds */}
          <div>
            <div className="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider mb-1.5">
              <span className="text-white">TOTAL ROUNDS</span>
              <span className="text-orange-500 font-mono">{rounds} Rounds</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRounds(r)}
                  className={`flex-1 py-2 rounded-xl text-xs font-display font-bold border transition-all ${
                    rounds === r
                      ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-[#162033] border-[#1E2B42] text-slate-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-display font-bold tracking-wider text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-transform"
        >
          <Check className="w-4 h-4" />
          <span>APPLY PROTOCOL SETTINGS</span>
        </button>
      </div>
    </div>
  );
};
