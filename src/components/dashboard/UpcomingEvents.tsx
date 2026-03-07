"use client";

import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  GraduationCap,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const EVENTS = [
  {
    id: 1,
    title: "Organic Chem Test",
    type: "Exam",
    date: "Mon, 12 Feb",
    time: "10:00 AM",
    color: "bg-red-100 text-red-700",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    id: 2,
    title: "Thermodynamics Lecture",
    type: "Class",
    date: "Tue, 13 Feb",
    time: "02:00 PM",
    color: "bg-blue-100 text-blue-700",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: 3,
    title: "Lab Report Due",
    type: "Deadline",
    date: "Wed, 14 Feb",
    time: "11:59 PM",
    color: "bg-amber-100 text-amber-700",
    icon: <FileText className="w-4 h-4" />,
  },
];

export default function UpcomingEvents() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" aria-hidden="true" />
          Your Schedule
        </h3>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
          View Calendar
        </button>
      </div>

      <div className="space-y-4">
        {EVENTS.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 group cursor-pointer">
            {/* Date Badge */}
            <div
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 font-bold text-xs transition-transform group-hover:scale-110",
                event.color,
              )}>
              <span>{event.date.split(", ")[1]?.split(" ")[0]}</span>
              <span className="text-sm">{event.date.split(", ")[0]}</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {event.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  {event.icon} {event.type}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" /> {event.time}
                </span>
              </div>
            </div>

            <ArrowRight
              className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all self-center"
              aria-hidden="true"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
