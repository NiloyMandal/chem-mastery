"use client";

import React, { useState } from "react";
import { PlayCircle, Video, Clock, Filter, BookOpen } from "lucide-react";

type RecordedClass = {
  id: string;
  title: string;
  topic: string;
  duration: string;
  date: string;
  thumbnail: string;
  isNew: boolean;
};

const INITIAL_CLASSES: RecordedClass[] = [
  {
    id: "1",
    title: "Thermodynamics Part 1: First Law of Thermodynamics",
    topic: "Physical Chemistry",
    duration: "1h 45m",
    date: "Mar 05, 2026",
    thumbnail: "bg-gradient-to-br from-orange-400 to-red-500",
    isNew: true,
  },
  {
    id: "2",
    title: "Organic Reaction Mechanisms: Nucleophilic Substitution",
    topic: "Organic Chemistry",
    duration: "2h 10m",
    date: "Mar 03, 2026",
    thumbnail: "bg-gradient-to-br from-green-400 to-emerald-600",
    isNew: false,
  },
  {
    id: "3",
    title: "Coordination Compounds & Crystal Field Theory",
    topic: "Inorganic Chemistry",
    duration: "1h 55m",
    date: "Feb 28, 2026",
    thumbnail: "bg-gradient-to-br from-blue-400 to-indigo-600",
    isNew: false,
  },
  {
    id: "4",
    title: "Chemical Equilibrium and Le Chatelier's Principle",
    topic: "Physical Chemistry",
    duration: "1h 30m",
    date: "Feb 25, 2026",
    thumbnail: "bg-gradient-to-br from-orange-400 to-amber-600",
    isNew: false,
  },
];

export default function RecordedClasses() {
  const [activeFilter, setActiveFilter] = useState("All Topics");

  const topics = [
    "All Topics",
    ...Array.from(new Set(INITIAL_CLASSES.map((c) => c.topic))),
  ];

  const filteredClasses =
    activeFilter === "All Topics"
      ? INITIAL_CLASSES
      : INITIAL_CLASSES.filter((c) => c.topic === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <Video className="w-8 h-8 text-indigo-600" /> Recorded Classes
            </h1>
            <p className="text-slate-500 mt-2">
              Catch up on missed lectures or review past concepts at your own
              pace.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 shadow-sm hover:bg-red-100 transition-colors">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Join Live Class
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-500 font-medium mr-2">
            <Filter className="w-5 h-5" /> Filter by:
          </div>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveFilter(topic)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${
                activeFilter === topic
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white text-slate-600 border hover:bg-slate-50"
              }`}>
              {topic}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed">
              <Video className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">
                No recorded classes found for this topic.
              </p>
            </div>
          ) : (
            filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                <div
                  className={`relative h-48 ${cls.thumbnail} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white transition-transform group-hover:scale-110 z-10 drop-shadow-lg" />

                  {cls.isNew && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg z-10">
                      NEW
                    </span>
                  )}

                  <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-xs font-bold font-mono flex items-center gap-1 z-10">
                    <Clock className="w-3 h-3" /> {cls.duration}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {cls.topic}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-auto">
                      {cls.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors mb-4">
                    {cls.title}
                  </h3>

                  <button className="mt-auto w-full py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" /> Watch Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
