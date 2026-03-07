"use client";

import React from "react";
import ProgressChart from "@/components/parent/ProgressChart";
import PTMScheduler from "@/components/parent/PTMScheduler";

interface StudentInfo {
  name: string;
  class: string;
  stream: string;
  attendance: number;
  avgScore: number;
}

// This could be fetched from Supabase in a real implementation
const STUDENT_DATA: StudentInfo = {
  name: "Alex Doe",
  class: "11-A",
  stream: "Science",
  attendance: 92,
  avgScore: 78,
};

export default function ParentDashboard() {
  const student = STUDENT_DATA;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Parent Portal</h1>
        <p className="text-slate-500">
          Track your child&apos;s progress and stay connected.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Student Profile
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl text-white font-bold">
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{student.name}</h3>
                <p className="text-slate-500 text-sm">
                  Class {student.class} • {student.stream} Stream
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xs text-blue-600 font-bold uppercase">
                  Attendance
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {student.attendance}%
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-xs text-green-600 font-bold uppercase">
                  Avg Score
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {student.avgScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="h-[400px]">
            <ProgressChart />
          </div>
        </div>

        {/* Action Section */}
        <div className="space-y-6">
          <div className="h-auto">
            <PTMScheduler />
          </div>

          {/* Notifications / Messages */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Recent Updates</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Chemistry Test Results
                  </p>
                  <p className="text-xs text-slate-500">Posted on Oct 24th</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Fee Payment Reminder
                  </p>
                  <p className="text-xs text-slate-500">Due by Nov 5th</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
