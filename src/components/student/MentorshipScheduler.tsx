"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

type MentorshipSlot = {
  id: string;
  date: string;
  time: string;
  mentor: string;
};

const AVAILABLE_SLOTS: MentorshipSlot[] = [
  { id: "1", date: "Mar 10, 2026", time: "16:00 - 16:15", mentor: "Dr. Roy" },
  { id: "2", date: "Mar 10, 2026", time: "16:30 - 16:45", mentor: "Prof. Das" },
  {
    id: "3",
    date: "Mar 12, 2026",
    time: "17:00 - 17:15",
    mentor: "Dr. Sharma",
  },
  { id: "4", date: "Mar 14, 2026", time: "15:00 - 15:15", mentor: "Dr. Mehta" },
];

export default function MentorshipScheduler() {
  const [bookedSession, setBookedSession] = useState<MentorshipSlot | null>(
    null,
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleBook = () => {
    if (!selectedSlot) return;
    const slot = AVAILABLE_SLOTS.find((s) => s.id === selectedSlot);
    if (slot) {
      setBookedSession(slot);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCancel = () => {
    setBookedSession(null);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-600" /> Mentorship Sessions
          </h1>
          <p className="text-slate-500 mt-2">
            Schedule your bi-weekly 15-minute 1-on-1 academic guidance sessions.
          </p>
        </header>

        {/* Upcoming Session Widget */}
        {bookedSession ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Upcoming Session
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  1-on-1 with {bookedSession.mentor}
                </h2>
                <div className="flex flex-wrap gap-4 text-indigo-100">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" /> {bookedSession.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> {bookedSession.time}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" /> Join Meeting
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-sm text-center">
                  Cancel Session
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" /> Available
              Slots
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {AVAILABLE_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                    selectedSlot === slot.id
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                  }`}>
                  <div
                    className={`p-3 rounded-xl ${selectedSlot === slot.id ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{slot.date}</h3>
                    <p className="text-sm text-slate-500 mb-2">{slot.time}</p>
                    <p className="text-xs font-medium text-indigo-600 bg-white px-2 py-1 rounded-md inline-block border">
                      {slot.mentor}
                    </p>
                  </div>
                  {selectedSlot === slot.id && (
                    <CheckCircle className="w-5 h-5 text-indigo-600 ml-auto" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleBook}
                disabled={!selectedSlot}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  selectedSlot
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}>
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" /> Session booked successfully!
        </div>
      )}
    </div>
  );
}
