"use client";

import { motion } from "framer-motion";

interface PHMeterProps {
  phValue: number;
  className?: string;
}

export default function PHMeter({ phValue, className }: PHMeterProps) {
  // Get color based on pH (0-14 scale)
  const getColor = (ph: number): string => {
    if (ph < 3) return "#dc2626"; // Red - Strong acid
    if (ph < 5) return "#f97316"; // Orange - Weak acid
    if (ph < 6) return "#facc15"; // Yellow
    if (ph < 8) return "#22c55e"; // Green - Neutral
    if (ph < 10) return "#3b82f6"; // Blue - Weak base
    if (ph < 12) return "#6366f1"; // Indigo
    return "#7c3aed"; // Purple - Strong base
  };

  const getLabel = (ph: number): string => {
    if (ph < 3) return "Strong Acid";
    if (ph < 6) return "Acidic";
    if (ph < 8) return "Neutral";
    if (ph < 11) return "Basic";
    return "Strong Base";
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Digital Display */}
      <div className="bg-slate-900 rounded-lg p-3 shadow-xl border border-slate-700">
        <p className="text-[0.5rem] text-slate-400 uppercase tracking-wider mb-1 text-center">
          pH Meter
        </p>
        <motion.div
          className="font-mono text-3xl font-bold text-center"
          style={{ color: getColor(phValue) }}
          key={phValue}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}>
          {phValue.toFixed(1)}
        </motion.div>
        <p className="text-[0.5rem] text-slate-400 text-center mt-1">
          {getLabel(phValue)}
        </p>
      </div>

      {/* pH Scale Bar */}
      <div className="mt-3 w-full">
        <div
          className="h-2 rounded-full relative"
          style={{
            background:
              "linear-gradient(to right, #dc2626, #f97316, #facc15, #22c55e, #3b82f6, #6366f1, #7c3aed)",
          }}>
          {/* Indicator Triangle */}
          <motion.div
            className="absolute -top-1 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-slate-800"
            style={{
              left: `${(phValue / 14) * 100}%`,
              transform: "translateX(-50%)",
            }}
            animate={{ left: `${(phValue / 14) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </div>
        <div className="flex justify-between text-[0.5rem] text-slate-500 mt-1 font-mono">
          <span>0</span>
          <span>7</span>
          <span>14</span>
        </div>
      </div>
    </div>
  );
}
