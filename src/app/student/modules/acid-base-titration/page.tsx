"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function AcidBaseTitrationModule() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/student"
          className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <header className="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
              Module 4
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
              In Progress
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Acid-Base Titration
          </h1>
          <p className="text-lg text-slate-600">
            Master the techniques of titration to determine concentration of
            unknown solutions.
          </p>

          <div className="w-full bg-slate-100 rounded-full h-3 mt-6">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: "75%" }}></div>
          </div>
          <p className="text-sm text-slate-500 mt-2 text-right">75% Complete</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <Section
              title="1. Introduction to Titration"
              type="reading"
              duration="10 min"
              completed={true}
            />
            <Section
              title="2. Choosing Indicators"
              type="video"
              duration="15 min"
              completed={true}
            />
            <Section
              title="3. Performing the Titration"
              type="video"
              duration="20 min"
              completed={true}
            />
            <Section
              title="4. Calculating Molarity"
              type="reading"
              duration="15 min"
              completed={false}
              current={true}
            />
            <Section
              title="5. Lab Simulation: Strong Acid vs Strong Base"
              type="lab"
              duration="30 min"
              completed={false}
            />
            <Section
              title="Final Assessment"
              type="quiz"
              duration="20 min"
              completed={false}
            />
          </div>

          <div className="col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
              <h3 className="font-bold text-slate-800 mb-4">
                Module Resources
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 cursor-pointer">
                  <FileText className="w-4 h-4" /> Cheat Sheet: Indicators
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 cursor-pointer">
                  <FileText className="w-4 h-4" /> Practice Problems PDF
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  type,
  duration,
  completed,
  current,
}: {
  title: string;
  type: string;
  duration: string;
  completed: boolean;
  current?: boolean;
}) {
  const icons: Record<string, ReactNode> = {
    reading: <BookOpen className="w-5 h-5" />,
    video: <Video className="w-5 h-5" />,
    lab: <FlaskConical className="w-5 h-5" />, // Assuming FlaskConical is imported or available, defined below for simplicity if not
    quiz: <CheckCircle className="w-5 h-5" />,
  };

  // Quick icon fallback if not imported
  const Icon = icons[type] || <FileText className="w-5 h-5" />;

  return (
    <div
      className={`p-5 rounded-xl border transition-all ${current ? "bg-blue-50 border-blue-200 ring-1 ring-blue-500 shadow-md" : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"} flex items-center justify-between group cursor-pointer`}>
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${completed ? "bg-green-100 text-green-600" : current ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
          {completed ? <CheckCircle className="w-5 h-5" /> : Icon}
        </div>
        <div>
          <h4
            className={`font-semibold ${completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
            {title}
          </h4>
          <p className="text-xs text-slate-500">
            {type.charAt(0).toUpperCase() + type.slice(1)} • {duration}
          </p>
        </div>
      </div>
      {current && (
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700">
          Start
        </button>
      )}
    </div>
  );
}

// Minimal Flask icon for this file since I didn't import enough above
function FlaskConical({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  );
}
