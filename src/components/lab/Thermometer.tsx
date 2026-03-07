"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ThermometerProps {
  temperature: number;
  min?: number;
  max?: number;
  className?: string;
}

export default function Thermometer({
  temperature,
  min = 0,
  max = 100,
  className,
}: ThermometerProps) {
  const percentage = Math.min(
    Math.max(((temperature - min) / (max - min)) * 100, 0),
    100,
  );

  const getColor = (t: number) => {
    if (t < 20) return "bg-blue-500";
    if (t < 40) return "bg-red-500";
    if (t < 80) return "bg-red-600";
    return "bg-red-700";
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Temperature Value Tag */}
      <motion.div
        className="absolute -top-8 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shadow-lg mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={temperature}>
        {temperature}°C
      </motion.div>

      {/* The Glass Tube */}
      <div className="w-4 h-48 bg-slate-200/50 rounded-t-full border border-slate-300 relative overflow-hidden backdrop-blur-sm z-10">
        {/* Ticks / Markings */}
        <div className="absolute right-0 top-0 bottom-0 w-full flex flex-col justify-between py-2 px-0.5 pointer-events-none z-20">
          {[max, max * 0.75, max * 0.5, max * 0.25, min].map((_val, i) => (
            <div
              key={i}
              className="w-1.5 h-[1px] bg-slate-400 self-end opacity-50"
            />
          ))}
        </div>

        {/* The Mercury (Liquid) */}
        <motion.div
          className={cn(
            "w-full absolute bottom-0 transition-colors duration-500",
            getColor(temperature),
          )}
          initial={{ height: "25%" }}
          animate={{ height: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      {/* The Bulb (Bottom) */}
      <div
        className={cn(
          "w-8 h-8 rounded-full -mt-2 border border-slate-300 z-20 flex items-center justify-center shadow-md transition-colors duration-500 relative",
          getColor(temperature),
        )}>
        {/* Reflection Detail */}
        <div className="w-2 h-2 bg-white/40 rounded-full absolute top-1.5 left-2" />
      </div>

      {/* Label */}
      <p className="text-[0.6rem] text-slate-500 font-medium mt-2 uppercase tracking-wider">
        Temp
      </p>
    </div>
  );
}
