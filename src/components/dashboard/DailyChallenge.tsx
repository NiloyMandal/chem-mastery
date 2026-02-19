'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, XCircle, Lock, Clock, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTION_BANK: Question[] = [
    // Easy
    { id: 'q1', text: 'What is the valency of Carbon?', options: ['2', '4', '6', '8'], correctIndex: 1, difficulty: 'easy' },
    { id: 'q2', text: 'What is the chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2, difficulty: 'easy' },
    { id: 'q3', text: 'How many electrons does Hydrogen have?', options: ['0', '1', '2', '3'], correctIndex: 1, difficulty: 'easy' },
    { id: 'q4', text: 'What is the atomic number of Oxygen?', options: ['6', '7', '8', '9'], correctIndex: 2, difficulty: 'easy' },
    { id: 'q5', text: 'Which gas is essential for respiration?', options: ['CO₂', 'N₂', 'O₂', 'H₂'], correctIndex: 2, difficulty: 'easy' },

    // Medium
    { id: 'q6', text: 'What is the pH of pure water at 25°C?', options: ['0', '7', '10', '14'], correctIndex: 1, difficulty: 'medium' },
    { id: 'q7', text: 'Which element has the highest electronegativity?', options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'], correctIndex: 2, difficulty: 'medium' },
    { id: 'q8', text: 'What is the molecular formula of Glucose?', options: ['C₆H₁₀O₅', 'C₆H₁₂O₆', 'C₅H₁₀O₅', 'C₁₂H₂₂O₁₁'], correctIndex: 1, difficulty: 'medium' },
    { id: 'q9', text: 'Which acid is found in vinegar?', options: ['Citric Acid', 'Acetic Acid', 'Lactic Acid', 'Formic Acid'], correctIndex: 1, difficulty: 'medium' },
    { id: 'q10', text: 'What type of bond is in NaCl?', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correctIndex: 1, difficulty: 'medium' },
    { id: 'q11', text: 'How many moles are in 22.4L of gas at STP?', options: ['0.5', '1', '2', '22.4'], correctIndex: 1, difficulty: 'medium' },

    // Hard
    { id: 'q12', text: 'What is the hybridization of carbon in Benzene?', options: ['sp', 'sp²', 'sp³', 'sp³d'], correctIndex: 1, difficulty: 'hard' },
    { id: 'q13', text: 'Which quantum number determines orbital shape?', options: ['n', 'l', 'm', 's'], correctIndex: 1, difficulty: 'hard' },
    { id: 'q14', text: 'What is the oxidation state of Mn in KMnO₄?', options: ['+4', '+5', '+6', '+7'], correctIndex: 3, difficulty: 'hard' },
    { id: 'q15', text: 'Which is the strongest reducing agent?', options: ['Li', 'Na', 'K', 'Cs'], correctIndex: 0, difficulty: 'hard' },
    { id: 'q16', text: 'What is the IUPAC name of CH₃CH₂OH?', options: ['Methanol', 'Ethanol', 'Propanol', 'Butanol'], correctIndex: 1, difficulty: 'hard' },
];

const DIFFICULTY_COLORS = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
};

const POINTS = { easy: 30, medium: 50, hard: 75 };

export default function DailyChallenge() {
    const [status, setStatus] = useState<'loading' | 'active' | 'completed'>('loading');
    const [question, setQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [streak, setStreak] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [nextUnlock, setNextUnlock] = useState<string>('');
    const [wasCorrectToday, setWasCorrectToday] = useState(false);

    // Helper: Get time until midnight
    const getTimeUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight.getTime() - now.getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hrs}h ${mins}m`;
    };

    // Initialize State from LocalStorage
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const lastPlayed = localStorage.getItem('chem_last_played');
        const lastResult = localStorage.getItem('chem_last_result');
        const currentStreak = parseInt(localStorage.getItem('chem_streak') || '0');

        setStreak(currentStreak);

        if (lastPlayed === today) {
            // User already played today
            setStatus('completed');
            setWasCorrectToday(lastResult === 'correct');
            setIsCorrect(lastResult === 'correct');
            setNextUnlock(getTimeUntilMidnight());
        } else {
            // New Day, New Question
            // Deterministic Random: Use day of year to pick index so everyone gets same daily Q
            const startOfYear = new Date(new Date().getFullYear(), 0, 0).getTime();
            const dayOfYear = Math.floor((Date.now() - startOfYear) / 86400000);
            const qIndex = dayOfYear % QUESTION_BANK.length;

            setQuestion(QUESTION_BANK[qIndex]);
            setStatus('active');
        }
    }, []);

    // Update countdown timer every minute
    useEffect(() => {
        if (status === 'completed') {
            const interval = setInterval(() => {
                setNextUnlock(getTimeUntilMidnight());
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [status]);

    const handleSelect = (index: number) => {
        if (status !== 'active') return;
        setSelectedOption(index);
    };

    const triggerConfetti = () => {
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors
        });
    };

    const handleSubmit = () => {
        if (selectedOption === null || !question) return;

        const correct = selectedOption === question.correctIndex;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const lastPlayed = localStorage.getItem('chem_last_played');

        setIsCorrect(correct);
        setWasCorrectToday(correct);

        // Update Streak Logic
        let newStreak = streak;
        if (correct) {
            // Increment streak only if they played yesterday (consecutive days)
            if (lastPlayed === yesterday) {
                newStreak = streak + 1;
            } else if (!lastPlayed) {
                // First time playing
                newStreak = 1;
            } else {
                // Missed days - reset streak but give 1 for today
                newStreak = 1;
            }
            triggerConfetti();
        }
        // Wrong answer doesn't break streak, it just doesn't extend it

        // Save to Storage
        localStorage.setItem('chem_last_played', today);
        localStorage.setItem('chem_last_result', correct ? 'correct' : 'wrong');
        localStorage.setItem('chem_streak', newStreak.toString());
        setStreak(newStreak);
        setStatus('completed');
        setNextUnlock(getTimeUntilMidnight());
    };

    if (status === 'loading') {
        return <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />;
    }

    const pointsEarned = question ? POINTS[question.difficulty] : 50;

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative h-full flex flex-col">

            {/* Header */}
            <div className={cn(
                "p-4 text-white flex justify-between items-center transition-colors duration-500",
                status === 'completed' && !isCorrect
                    ? "bg-slate-700"
                    : "bg-gradient-to-r from-orange-500 to-red-500"
            )}>
                <div className="flex items-center gap-2 font-bold">
                    <Flame
                        className={cn("w-5 h-5 fill-white", status === 'active' && "animate-pulse")}
                        aria-hidden="true"
                    />
                    {status === 'completed' ? "Challenge Done" : "Daily Challenge"}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <Trophy className="w-3 h-3" aria-hidden="true" /> {streak} Day Streak
                    </span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">

                {status === 'active' && question ? (
                    <>
                        {/* Active Question View */}
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <h3 className="font-bold text-slate-800 text-lg leading-snug">{question.text}</h3>
                            <span className={cn(
                                "text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide shrink-0",
                                DIFFICULTY_COLORS[question.difficulty]
                            )}>
                                {question.difficulty}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group",
                                        selectedOption === idx
                                            ? "border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500"
                                            : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                                    )}
                                    aria-pressed={selectedOption === idx}
                                >
                                    <span className={cn(
                                        "text-sm font-medium",
                                        selectedOption === idx ? "text-indigo-900" : "text-slate-600"
                                    )}>
                                        {opt}
                                    </span>
                                    {selectedOption === idx && (
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" aria-hidden="true" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className={cn(
                                "w-full mt-8 py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg",
                                selectedOption !== null
                                    ? "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-indigo-500/25"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                            )}
                        >
                            Lock In Answer
                        </button>

                        <p className="text-center text-xs text-slate-400 mt-3">
                            ⚠️ One attempt per day!
                        </p>
                    </>
                ) : (
                    /* Locked / Completed View */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl",
                            wasCorrectToday ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                        )}>
                            {wasCorrectToday
                                ? <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
                                : <XCircle className="w-10 h-10" aria-hidden="true" />
                            }
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {wasCorrectToday ? `Correct! +${pointsEarned} XP` : "Missed it!"}
                        </h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-[220px] mx-auto">
                            {wasCorrectToday
                                ? "You've kept your streak alive. Come back tomorrow for more!"
                                : "Don't worry, even Nobel laureates have bad days."}
                        </p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3">
                            <Lock className="w-4 h-4 text-slate-400" aria-hidden="true" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Next Question In</p>
                                <p className="text-sm font-mono font-bold text-slate-700 flex items-center gap-1">
                                    <Clock className="w-3 h-3" aria-hidden="true" /> {nextUnlock}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
