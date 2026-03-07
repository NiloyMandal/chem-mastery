"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  LayoutList,
  Calendar,
  BookOpen,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

type Task = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
};

type DayPlan = {
  day: string;
  date: string;
  tasks: Task[];
};

const INITIAL_PLAN: DayPlan[] = [
  {
    day: "Mon",
    date: "Mar 08",
    tasks: [
      {
        id: "1",
        title: "Read Chapter 4: Thermodynamics",
        duration: "45m",
        completed: true,
        priority: "High",
      },
      {
        id: "2",
        title: "Solve Level 1 Assignment",
        duration: "30m",
        completed: true,
        priority: "Medium",
      },
    ],
  },
  {
    day: "Tue",
    date: "Mar 09",
    tasks: [
      {
        id: "3",
        title: "Watch Recorded Class over Equilibrium",
        duration: "1h",
        completed: true,
        priority: "High",
      },
      {
        id: "4",
        title: "Review Class Notes",
        duration: "20m",
        completed: false,
        priority: "Low",
      },
    ],
  },
  {
    day: "Wed",
    date: "Mar 10",
    tasks: [
      {
        id: "5",
        title: "Complete Level 2 Assignment",
        duration: "45m",
        completed: false,
        priority: "High",
      },
      {
        id: "6",
        title: "Mentorship Session prep notes",
        duration: "15m",
        completed: false,
        priority: "Medium",
      },
    ],
  },
  {
    day: "Thu",
    date: "Mar 11",
    tasks: [
      {
        id: "7",
        title: "Practice Organic Canvas Draw",
        duration: "30m",
        completed: false,
        priority: "Low",
      },
    ],
  },
  {
    day: "Fri",
    date: "Mar 12",
    tasks: [
      {
        id: "8",
        title: "Virtual Lab: Acid-Base Titration",
        duration: "1h",
        completed: false,
        priority: "High",
      },
      {
        id: "9",
        title: "Submit Weekly Report",
        duration: "15m",
        completed: false,
        priority: "Medium",
      },
    ],
  },
];

export default function StudyPlanner() {
  const [planner, setPlanner] = useState<DayPlan[]>(INITIAL_PLAN);
  const [activeDay, setActiveDay] = useState<string>("Wed");

  const toggleTask = (dayIndex: number, taskId: string) => {
    setPlanner((prev) => {
      const newPlanner = [...prev];
      newPlanner[dayIndex] = {
        ...newPlanner[dayIndex],
        tasks: newPlanner[dayIndex].tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        ),
      };
      return newPlanner;
    });
  };

  const totalTasks = planner.flatMap((d) => d.tasks).length;
  const completedTasks = planner
    .flatMap((d) => d.tasks)
    .filter((t) => t.completed).length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  const activeDayIndex = planner.findIndex((d) => d.day === activeDay);
  const activeTasks = planner[activeDayIndex]?.tasks || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <LayoutList className="w-8 h-8 text-indigo-600" /> Weekly Study
              Planner
            </h1>
            <p className="text-slate-500 mt-2">
              Stay on track by breaking your assignments into manageable daily
              tasks.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-6 min-w-[250px]">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                Weekly Progress
              </p>
              <p className="text-2xl font-extrabold text-slate-800">
                {progressPercentage}%
              </p>
            </div>
            <div className="flex-1">
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">
                {completedTasks} of {totalTasks} tasks done
              </p>
            </div>
          </div>
        </header>

        {/* Days Navigation */}
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {planner.map((dayPlan) => {
            const dayCompleted =
              dayPlan.tasks.length > 0 &&
              dayPlan.tasks.every((t) => t.completed);

            return (
              <button
                key={dayPlan.day}
                onClick={() => setActiveDay(dayPlan.day)}
                className={`py-4 flex flex-col items-center justify-center rounded-2xl border transition-all ${
                  activeDay === dayPlan.day
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                    : dayCompleted
                      ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                }`}>
                <span
                  className={`text-xs font-bold mb-1 ${activeDay === dayPlan.day ? "text-indigo-200" : "text-slate-400"}`}>
                  {dayPlan.day}
                </span>
                <span className="text-lg font-extrabold">
                  {dayPlan.date.split(" ")[1]}
                </span>

                {/* Mini progress dots */}
                <div className="flex gap-1 mt-3">
                  {dayPlan.tasks.map((t, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.completed
                          ? activeDay === dayPlan.day
                            ? "bg-white"
                            : "bg-emerald-500"
                          : activeDay === dayPlan.day
                            ? "bg-indigo-400"
                            : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Day Tasks */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b bg-slate-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Tasks for{" "}
                {activeDay}, {planner[activeDayIndex]?.date}
              </h2>
              <p className="text-slate-500 mt-1">
                You have {activeTasks.filter((t) => !t.completed).length}{" "}
                incomplete tasks today.
              </p>
            </div>
            <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
              + Add Task
            </button>
          </div>

          <div className="divide-y">
            {activeTasks.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p>No tasks scheduled for this day.</p>
              </div>
            ) : (
              activeTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 md:p-6 flex items-start gap-4 transition-colors ${
                    task.completed ? "bg-slate-50/50" : "hover:bg-slate-50"
                  }`}>
                  <button
                    onClick={() => toggleTask(activeDayIndex, task.id)}
                    className={`mt-1 flex-shrink-0 transition-colors ${
                      task.completed
                        ? "text-emerald-500"
                        : "text-slate-300 hover:text-indigo-400"
                    }`}>
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="flex-1 pb-1">
                    <h3
                      className={`font-bold text-lg mb-2 ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span
                        className={`flex items-center gap-1 ${task.completed ? "text-slate-400" : "text-slate-500"}`}>
                        <Clock className="w-4 h-4" /> {task.duration}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <BookOpen className="w-4 h-4" /> Chemistry
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
