'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const SLOTS = [
    '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
    '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM'
];

export default function PTMScheduler() {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooked, setIsBooked] = useState(false);
    const [reason, setReason] = useState('');

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSlot) {
            setIsBooked(true);
        }
    };

    if (isBooked) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Meeting Confirmed!</h2>
                <p className="text-slate-500 mb-6">You are scheduled for {selectedSlot} on Friday.</p>
                <button
                    onClick={() => { setIsBooked(false); setSelectedSlot(null); setReason(''); }}
                    className="text-blue-600 font-medium hover:underline"
                >
                    Book another slot
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-indigo-50/50">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Book Teacher Meeting
                </h2>
                <p className="text-sm text-indigo-600/70">Next Availability: Friday, Nov 15th</p>
            </div>

            <div className="p-6 flex-1 overflow-auto">
                <form onSubmit={handleBook} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" /> Select Time Slot (15 min)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SLOTS.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={cn(
                                        "px-2 py-2 rounded-lg text-sm border transition-all",
                                        selectedSlot === slot
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
                                    )}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-2">
                            Meeting Agenda (Optional)
                        </label>
                        <textarea
                            id="reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Discuss recent chemistry test performance..."
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedSlot}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
                    >
                        Confirm Booking
                    </button>

                </form>
            </div>
        </div>
    );
}
