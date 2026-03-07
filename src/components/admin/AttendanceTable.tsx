"use client";

import { useState } from "react";
import { QrCode, Check, X, Search, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface Student {
  id: string;
  name: string;
  batch: string;
  status: "present" | "absent" | "pending";
  lastSeen?: string;
}

const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Alice Freeman",
    batch: "Batch A - Morning",
    status: "pending",
  },
  {
    id: "2",
    name: "Bob Smith",
    batch: "Batch A - Morning",
    status: "present",
    lastSeen: "09:05 AM",
  },
  {
    id: "3",
    name: "Charlie Davis",
    batch: "Batch B - Evening",
    status: "absent",
  },
  {
    id: "4",
    name: "Diana Prince",
    batch: "Batch A - Morning",
    status: "pending",
  },
  {
    id: "5",
    name: "Ethan Hunt",
    batch: "Batch B - Evening",
    status: "pending",
  },
];

export default function AttendanceTable() {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [isScanning, setIsScanning] = useState(false);

  const toggleStatus = (id: string, newStatus: "present" | "absent") => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: newStatus,
              lastSeen:
                newStatus === "present"
                  ? new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : undefined,
            }
          : s,
      ),
    );
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate scanning a random pending student
      const pending = students.find((s) => s.status === "pending");
      if (pending) {
        toggleStatus(pending.id, "present");
      }
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Attendance Manager
          </h2>
          <p className="text-sm text-slate-500">
            Today, {new Date().toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={simulateScan}
          disabled={isScanning}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
            isScanning
              ? "bg-green-100 text-green-700 animate-pulse"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
          )}>
          <QrCode className="w-5 h-5" />
          {isScanning ? "Scanning..." : "Scan QR Code"}
        </button>
      </div>

      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Batch</th>
              <th className="px-6 py-3">Time In</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{student.batch}</td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                  {student.lastSeen || "--:--"}
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button
                    onClick={() => toggleStatus(student.id, "present")}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      student.status === "present"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200",
                    )}
                    title="Mark Present">
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleStatus(student.id, "absent")}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      student.status === "absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200",
                    )}
                    title="Mark Absent">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
