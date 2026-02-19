'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Flame } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface StudentRank {
    id: string;
    rank: number;
    name: string;
    points: number;
    streak: number; // Daily streak
    avatar: string;
}

// Mock leaderboard data
const MOCK_LEADERBOARD: StudentRank[] = [
    { id: '1', rank: 1, name: 'Aarav Patel', points: 2850, streak: 12, avatar: '🥇' },
    { id: '2', rank: 2, name: 'Sneha Gupta', points: 2620, streak: 8, avatar: '🥈' },
    { id: '3', rank: 3, name: 'Priya Singh', points: 2410, streak: 15, avatar: '🥉' },
    { id: '4', rank: 4, name: 'Amit Sharma', points: 2240, streak: 5, avatar: '😊' },
    { id: '5', rank: 5, name: 'Kavya Reddy', points: 2120, streak: 10, avatar: '📚' },
];

export default function Leaderboard() {
    const leaderboard = MOCK_LEADERBOARD;

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                    Reaction Run Leaderboard
                </h2>
                <p className="text-blue-100 text-sm mt-1">Top performers this week!</p>
            </div>

            <div className="p-4">
                {leaderboard.map((student, index) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-xl mb-2 transition-all hover:bg-slate-50",
                            student.rank <= 3 ? "border border-yellow-100 bg-yellow-50/30" : "border border-transparent"
                        )}
                    >
                        {/* Rank Badge */}
                        <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 relative">
                            {student.rank === 1 && <Medal className="w-6 h-6 text-yellow-500 absolute" />}
                            {student.rank === 2 && <Medal className="w-6 h-6 text-slate-400 absolute" />}
                            {student.rank === 3 && <Medal className="w-6 h-6 text-orange-400 absolute" />}
                            <span className={cn("relative z-10", student.rank <= 3 ? "text-white text-xs mt-1" : "text-lg")}>
                                {student.rank <= 3 ? student.rank : `#${student.rank}`}
                            </span>
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-sm border border-slate-200">
                            {student.avatar}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-800">{student.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1 text-orange-500 font-medium">
                                    <Flame className="w-3 h-3" /> {student.streak} day streak
                                </span>
                            </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                            <span className="block font-bold text-blue-600">{student.points}</span>
                            <span className="text-xs text-slate-400">pts</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                <button className="text-sm text-blue-600 font-medium hover:underline">View Full Leaderboard</button>
            </div>
        </div>
    );
}
