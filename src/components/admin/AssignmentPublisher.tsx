"use client";

import React, { useState } from "react";
import { Plus, Clock, Trash2, CheckCircle } from "lucide-react";

type Assignment = {
  id: number;
  title: string;
  level: number;
  dueDate: string;
  submissions: number;
  totalStudents: number;
};

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    title: "Atomic Structure Basics",
    level: 1,
    dueDate: "Mar 10, 2026",
    submissions: 105,
    totalStudents: 120,
  },
  {
    id: 2,
    title: "Chemical Bonding Theories",
    level: 3,
    dueDate: "Mar 12, 2026",
    submissions: 45,
    totalStudents: 120,
  },
  {
    id: 3,
    title: "Thermodynamics Advanced Problems",
    level: 5,
    dueDate: "Mar 15, 2026",
    submissions: 12,
    totalStudents: 50,
  },
];

export default function AssignmentPublisher({
  showToast,
}: {
  showToast: (m: string) => void;
}) {
  const [assignments, setAssignments] =
    useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    level: 1,
    dueDate: "",
  });

  const openAdd = () => {
    setForm({ title: "", level: 1, dueDate: "" });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.dueDate) return;
    const newAssignment = {
      id: Date.now(),
      ...form,
      submissions: 0,
      totalStudents: 120, // Example cohort size
    };
    setAssignments([newAssignment, ...assignments]);
    showToast("Assignment published successfully!");
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    showToast("Assignment deleted!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Assignment Publisher
          </h2>
          <p className="text-slate-500 text-sm">
            Create and manage tiered assignments (Levels 1-5).
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
          <Plus className="w-4 h-4" /> Publish New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-2xl border shadow-sm p-6 group hover:shadow-lg transition-all relative">
            <div className="flex justify-between items-start mb-4">
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
              <button
                onClick={() => handleDelete(assignment.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">
              {assignment.title}
            </h3>
            <div className="flex flex-col gap-2 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Due: {assignment.dueDate}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-slate-400" />
                {assignment.submissions} / {assignment.totalStudents} Submitted
              </div>
            </div>

            <div className="mt-5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{
                  width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-800">
                Publish Assignment
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Organic Chemistry Quiz"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Difficulty Level (1-5)
                </label>
                <select
                  value={form.level}
                  onChange={(e) =>
                    setForm({ ...form, level: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value={1}>Level 1 - Basics</option>
                  <option value={2}>Level 2 - Intermediate</option>
                  <option value={3}>Level 3 - Standard</option>
                  <option value={4}>Level 4 - Advanced</option>
                  <option value={5}>Level 5 - Challenge</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
