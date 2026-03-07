"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

type Assignment = {
  id: number;
  title: string;
  level: number;
  dueDate: string;
  status: "Pending" | "Completed";
  score?: number;
};

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    title: "Atomic Structure Basics",
    level: 1,
    dueDate: "Mar 10, 2026",
    status: "Completed",
    score: 95,
  },
  {
    id: 2,
    title: "Chemical Bonding Theories",
    level: 3,
    dueDate: "Mar 12, 2026",
    status: "Pending",
  },
  {
    id: 3,
    title: "Thermodynamics Advanced Problems",
    level: 5,
    dueDate: "Mar 15, 2026",
    status: "Pending",
  },
];

export default function AssignmentSolver() {
  const [assignments, setAssignments] =
    useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [activeLevel, setActiveLevel] = useState<number | "All">("All");

  const filteredAssignments =
    activeLevel === "All"
      ? assignments
      : assignments.filter((a) => a.level === activeLevel);

  const handleSolve = (id: number) => {
    // Mocking the solve action by marking as completed
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "Completed",
              score: Math.floor(Math.random() * 20) + 80,
            }
          : a,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" /> Daily Assignments
          </h1>
          <p className="text-slate-500 mt-2">
            Progressively improve your understanding from Basics to Challenge
            problems.
          </p>
        </header>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveLevel("All")}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors ${
              activeLevel === "All"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white text-slate-600 border hover:bg-slate-50"
            }`}>
            All Levels
          </button>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors ${
                activeLevel === level
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white text-slate-600 border hover:bg-slate-50"
              }`}>
              Level {level}
            </button>
          ))}
        </div>

        {/* Assignment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.length === 0 ? (
            <div className="col-span-1 md:col-span-2 text-center py-16 bg-white rounded-2xl border shadow-sm">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">
                No assignments found for this level.
              </p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden group">
                <div
                  className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 transition-transform group-hover:scale-150 ${
                    assignment.level === 1
                      ? "bg-green-500"
                      : assignment.level === 2
                        ? "bg-emerald-500"
                        : assignment.level === 3
                          ? "bg-amber-500"
                          : assignment.level === 4
                            ? "bg-orange-500"
                            : "bg-red-500"
                  }`}
                />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      assignment.level === 1
                        ? "bg-green-100 text-green-700"
                        : assignment.level === 2
                          ? "bg-emerald-100 text-emerald-700"
                          : assignment.level === 3
                            ? "bg-amber-100 text-amber-700"
                            : assignment.level === 4
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                    }`}>
                    Level {assignment.level}
                  </span>

                  {assignment.status === "Completed" ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">
                  {assignment.title}
                </h3>

                <p className="text-sm text-slate-500 mb-6 flex items-center gap-2 relative z-10">
                  <Clock className="w-4 h-4" /> Due: {assignment.dueDate}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t relative z-10">
                  {assignment.status === "Completed" ? (
                    <div className="text-slate-700 font-bold">
                      Score:{" "}
                      <span className="text-indigo-600">
                        {assignment.score}%
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm">Not graded yet</div>
                  )}

                  <button
                    onClick={() => handleSolve(assignment.id)}
                    disabled={assignment.status === "Completed"}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ${
                      assignment.status === "Completed"
                        ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/25"
                    }`}>
                    {assignment.status === "Completed" ? "Review" : "Solve Now"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
