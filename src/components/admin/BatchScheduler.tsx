"use client";

import { useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";

interface ScheduleItem {
  day: string;
  slots: {
    time: string;
    batch: string;
    subject: string;
  }[];
}

export default function BatchScheduler() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("/api/schedule");
        if (response.ok) {
          const data = await response.json();
          setSchedule(data);
        } else {
          console.error("Failed to fetch schedule");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Weekly Batch Schedule
        </h2>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-1 md:col-span-5 flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          schedule.map((day) => (
            <div key={day.day} className="flex flex-col gap-2">
              <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider text-center bg-slate-50 py-2 rounded-lg border border-slate-100">
                {day.day}
              </h3>
              <div className="space-y-2">
                {day.slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                    <p className="text-xs text-indigo-500 font-bold mb-1">
                      {slot.time}
                    </p>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-700">
                      {slot.batch}
                    </p>
                    <p className="text-xs text-slate-500">{slot.subject}</p>
                  </div>
                ))}
                {day.slots.length === 0 && (
                  <div className="p-4 text-center text-slate-300 text-xs italic border border-dashed border-slate-200 rounded-xl">
                    No Classes
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {!loading && schedule.length === 0 && (
          <div className="col-span-1 md:col-span-5 text-center py-10 text-slate-400">
            No schedule data available.
          </div>
        )}
      </div>
    </div>
  );
}
