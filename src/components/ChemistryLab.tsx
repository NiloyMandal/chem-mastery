'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, FlaskConical, AlertTriangle, Beaker, Glasses, ShieldAlert, Droplets } from 'lucide-react';
import { cn } from '@/lib/ui';
import Thermometer from './lab/Thermometer';
import PHMeter from './lab/PHMeter';
import {
    CHEMICALS,
    REACTION_DATABASE,
    Chemical,
    ReactionResult,
    getReactionKey,
    mixColors,
    calculatePH
} from '@/data/reaction-database';

export default function ChemistryLab() {
    const [beakerContents, setBeakerContents] = useState<Chemical[]>([]);
    const [reactionResult, setReactionResult] = useState<ReactionResult | null>(null);
    const [temperature, setTemperature] = useState(25); // Room temperature
    const [phValue, setPHValue] = useState(7); // Neutral
    const [safetyWarning, setSafetyWarning] = useState<string | null>(null);
    const [consumedSolids, setConsumedSolids] = useState<string[]>([]);

    // 🌟 NEW: Volume & Animation State
    const [volume, setVolume] = useState(0);
    const [isPouring, setIsPouring] = useState(false);

    // 🌟 NEW: PPE State
    const [ppe, setPpe] = useState({
        goggles: false,
        gloves: false,
        apron: false
    });

    const BEAKER_CAPACITY = 500; // ml

    // Calculate current mixed color from beaker contents
    const currentColor = useMemo(() => {
        if (reactionResult?.resultHex) return reactionResult.resultHex;
        const hexColors = beakerContents.map(c => c.hexColor);
        return mixColors(hexColors);
    }, [beakerContents, reactionResult]);

    // Cooling down effect
    useEffect(() => {
        if (temperature > 25) {
            const timer = setInterval(() => {
                setTemperature(prev => Math.max(prev - 1, 25));
            }, 2000);
            return () => clearInterval(timer);
        }
    }, [temperature]);

    // Clear safety warning after 5 seconds
    useEffect(() => {
        if (safetyWarning) {
            const timer = setTimeout(() => setSafetyWarning(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [safetyWarning]);

    const handleDrop = (e: React.DragEvent, chemical: Chemical) => {
        e.preventDefault();

        // 🛑 Volume Check
        if (volume >= BEAKER_CAPACITY) {
            alert("Beaker is full! Empty it first.");
            return;
        }

        // Add 50ml or custom amount
        const addAmount = 50;
        setVolume(prev => Math.min(prev + addAmount, BEAKER_CAPACITY));

        // 🌟 Trigger Pouring Animation
        setIsPouring(true);
        setTimeout(() => setIsPouring(false), 800);

        // 🛑 Safety Checks
        let warning = null;

        // Alkali Metal + Water (Needs Goggles)
        if ((chemical.id === 'k' || chemical.id === 'na') && beakerContents.some(c => c.id === 'water')) {
            if (!ppe.goggles) {
                warning = '🔥 EYES INJURED! Alkali metals explode in water. Always wear goggles!';
            }
        }

        // Acid + No Gloves/Apron (General warning, though technically depends on concentration)
        if (chemical.type === 'acid' && (!ppe.gloves || !ppe.apron)) {
            // Optional: stricter check
        }

        if (warning) {
            setSafetyWarning(warning);
            // If severe injury, maybe reset or penalize? keeping it simple for now
        }

        const newContents = [...beakerContents, chemical];
        setBeakerContents(newContents);
        checkReaction(newContents);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const checkReaction = (contents: Chemical[]) => {
        // Create lookup key from chemical IDs
        const ids = contents.map(c => c.id);
        const reactionKey = getReactionKey(ids);

        // Check database for reaction
        const reaction = REACTION_DATABASE[reactionKey];

        if (reaction) {
            setReactionResult(reaction);

            // Update temperature
            if (reaction.heat) {
                setTemperature(prev => Math.min(prev + reaction.heat!, 100));
            }

            // Update pH
            if (reaction.phChange !== undefined) {
                setPHValue(reaction.phChange);
            }

            // Handle consumed solids
            if (reaction.consumesSolids) {
                const solidIds = contents.filter(c => c.state === 'solid').map(c => c.id);
                setTimeout(() => setConsumedSolids(solidIds), 2000);
            }

            // Handle safety warning from reaction definition
            if (reaction.safetyWarning) {
                // Check if PPE protects against this specific warning? 
                // For now, just show it if it's a dangerous reaction not caught by handleDrop
                if (!ppe.goggles) setSafetyWarning(reaction.safetyWarning);
            }
        } else {
            // No specific reaction - just mix colors and calculate average pH
            setReactionResult({
                description: 'No reaction observed. Chemicals are mixed.',
            });
            setPHValue(calculatePH(contents));
        }
    };

    const clearBeaker = () => {
        setBeakerContents([]);
        setReactionResult(null);
        setTemperature(25);
        setPHValue(7);
        setSafetyWarning(null);
        setConsumedSolids([]);
        setVolume(0);
    };

    // Get solids that are still visible (not consumed)
    const visibleSolids = beakerContents.filter(
        c => c.state === 'solid' && !consumedSolids.includes(c.id)
    );

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-50 p-4 lg:p-6 gap-4 lg:gap-6 font-sans text-slate-900">

            {/* Safety Warning Overlay with "Cracked Screen" Effect */}
            <AnimatePresence>
                {safetyWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/40 backdrop-blur-[2px]"
                        onClick={() => setSafetyWarning(null)}
                    >
                        {/* Cracked screen SVG overlay could go here */}
                        <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cracked-glass.png')]" />

                        <motion.div
                            className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border-4 border-red-500 relative z-10"
                            initial={{ scale: 0.8, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0, transition: { type: 'spring', bounce: 0.5 } }}
                        >
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            </div>
                            <h2 className="text-3xl font-black text-red-700 mb-2 uppercase tracking-wide">Accident!</h2>
                            <p className="text-slate-800 text-lg font-medium">{safetyWarning}</p>
                            <button
                                onClick={() => setSafetyWarning(null)}
                                className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg hover:shadow-red-500/30 transition-all"
                            >
                                CALL NURSE
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar: Chemical Shelf */}
            <div className="lg:w-1/4 flex flex-col gap-4">

                {/* 🛡️ PPE Toolbar */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Safety Gear (PPE)</h3>
                    <div className="flex justify-between gap-2">
                        {[
                            { id: 'goggles', icon: Glasses, label: 'Goggles' },
                            { id: 'gloves', icon: Droplets, label: 'Gloves' }, // Using Droplets as simplified icon for now
                            { id: 'apron', icon: ShieldAlert, label: 'Apron' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setPpe(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof ppe] }))}
                                className={cn(
                                    "flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200",
                                    ppe[item.id as keyof typeof ppe]
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[0.6rem] font-bold uppercase">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-slate-200 overflow-y-auto flex-1">
                    <h2 className="text-lg lg:text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                        <FlaskConical className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                        Chemical Shelf
                    </h2>

                    {/* Category Tabs */}
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Drag to beaker →</div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3">
                        {CHEMICALS.map((chem) => (
                            <div
                                key={chem.id}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('chemical', JSON.stringify(chem));
                                    // Could add a "ghost" drag image here
                                }}
                                className={cn(
                                    "p-2 lg:p-3 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-md transition-all border border-slate-100 flex items-center gap-2 lg:gap-3 group",
                                    "bg-white hover:bg-slate-50",
                                    chem.id === 'k' && "border-red-200 bg-red-50 hover:bg-red-100" // Dangerous
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 lg:w-10 lg:h-10 rounded-lg shadow-sm flex items-center justify-center text-[0.6rem] lg:text-xs font-bold text-white/90",
                                        chem.state === 'solid' ? 'rounded-sm' : ''
                                    )}
                                    style={{ backgroundColor: chem.hexColor }}
                                >
                                    {chem.formula}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs lg:text-sm text-slate-800 truncate">{chem.name}</p>
                                    <p className="text-[0.6rem] lg:text-xs text-slate-500 capitalize">{chem.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Lab Area */}
            <div className="flex-1 bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 lg:p-8 border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center">

                <div className="flex justify-between items-start mb-4 lg:mb-0 z-20">
                    <div>
                        <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                            <Beaker className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-400" />
                            Virtual Chemistry Lab
                        </h1>
                        <p className="text-slate-400 text-sm">Drag chemicals to experiment. Watch your volume!</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Volume Indicator */}
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Volume</span>
                            <span className={cn(
                                "text-2xl font-mono font-bold",
                                volume > 400 ? "text-orange-400" : "text-slate-200"
                            )}>
                                {volume}<span className="text-sm text-slate-400 ml-1">ml</span>
                            </span>
                        </div>

                        <button
                            onClick={clearBeaker}
                            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    </div>
                </div>

                {/* Reaction Display */}
                <AnimatePresence mode='wait'>
                    {reactionResult && reactionResult.equation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute top-20 lg:top-24 left-4 right-4 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 z-10 bg-white/95 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-2xl max-w-lg w-auto text-center border border-slate-200"
                        >
                            <p className="text-base lg:text-xl font-bold text-indigo-700 mb-2 font-mono">{reactionResult.equation}</p>
                            <p className="text-slate-700 text-sm lg:text-base">{reactionResult.description}</p>
                            {reactionResult.heat && reactionResult.heat > 20 && (
                                <p className="text-orange-500 text-xs mt-2 font-bold flex items-center justify-center gap-1">
                                    🔥 Heat Released (+{reactionResult.heat}°C)
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lab Bench */}
                <div className="flex-1 flex items-end justify-center gap-4 lg:gap-8 pb-4 lg:pb-12">

                    {/* pH Meter */}
                    <PHMeter phValue={phValue} className="hidden md:block mb-4" />

                    {/* The Beaker */}
                    <div
                        onDrop={(e) => {
                            const chem = JSON.parse(e.dataTransfer.getData('chemical'));
                            handleDrop(e, chem);
                        }}
                        onDragOver={handleDragOver}
                        className="relative w-48 h-72 lg:w-72 lg:h-96 border-4 border-slate-600/50 border-t-0 rounded-b-[2rem] lg:rounded-b-[3rem] bg-slate-800/30 flex items-end justify-center overflow-hidden z-0 backdrop-blur-sm"
                    >
                        {/* Glass Reflections */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-black/5 pointer-events-none z-20 rounded-b-[3rem]" />
                        <div className="absolute left-3 lg:left-4 top-10 bottom-10 w-1.5 lg:w-2 bg-white/50 blur-sm rounded-full z-20" />

                        {/* 💨 Smoke / Steam Effect (if hot) */}
                        {temperature > 80 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                className="absolute bottom-1/2 left-0 right-0 h-48 bg-gradient-to-t from-gray-200/50 to-transparent blur-xl z-20"
                            />
                        )}

                        {/* Liquid Fill */}
                        <motion.div
                            className={cn("w-full relative z-10 transition-colors duration-500", isPouring && "animate-pulse")}
                            style={{ backgroundColor: currentColor }}
                            initial={{ height: '0%' }}
                            animate={{
                                height: `${(volume / BEAKER_CAPACITY) * 100}%`,
                                transition: { type: 'spring', bounce: 0.2, duration: 0.8 } // Smooth filling
                            }}
                        >
                            {/* Ripple Effect Surface */}
                            <div className={cn(
                                "absolute top-0 left-0 right-0 h-2 bg-white/30 skew-x-12 origin-left",
                                isPouring ? "opacity-100 scale-y-150 transition-transform" : "opacity-0"
                            )} />

                            {/* Precipitate */}
                            {reactionResult?.precipitate && (
                                <motion.div
                                    className={cn(
                                        "absolute bottom-0 w-full h-12 blur-sm opacity-80",
                                        reactionResult.precipitate === 'white' && 'bg-white',
                                        reactionResult.precipitate === 'yellow' && 'bg-yellow-400',
                                        reactionResult.precipitate === 'brown' && 'bg-amber-600',
                                        reactionResult.precipitate === 'blue' && 'bg-cyan-300',
                                        reactionResult.precipitate === 'green' && 'bg-green-400',
                                    )}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                />
                            )}

                            {/* Floating Solids */}
                            <AnimatePresence>
                                {visibleSolids.map((solid, i) => (
                                    <motion.div
                                        key={`solid-${solid.id}-${i}`}
                                        initial={{ y: -100, opacity: 0, rotate: 0 }}
                                        animate={{
                                            y: 120 + (i * 10),
                                            opacity: 1,
                                            rotate: Math.random() * 45 - 22
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: 'spring', damping: 15 }}
                                        className="absolute w-4 h-3 lg:w-6 lg:h-4 rounded-sm border border-black/20 shadow-sm z-30"
                                        style={{
                                            left: `${15 + (i * 20) % 60}%`,
                                            backgroundColor: solid.hexColor
                                        }}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Bubbles Animation */}
                            {(reactionResult?.bubbles || isPouring) && (
                                <>
                                    {[...Array(15)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute bottom-0 w-2 h-2 lg:w-3 lg:h-3 bg-white/60 rounded-full border border-white"
                                            initial={{ opacity: 0, y: 0, x: Math.random() * 150 - 75 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                y: [-10, -500], // Float up higher
                                                x: Math.random() * 80 - 40
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1 + Math.random(),
                                                delay: Math.random() * 2,
                                                ease: "linear"
                                            }}
                                            style={{ left: `${Math.random() * 100}%` }}
                                        />
                                    ))}
                                </>
                            )}
                        </motion.div>

                        {/* Beaker Markings */}
                        <div className="absolute right-0 top-8 lg:top-12 bottom-8 lg:bottom-12 w-10 lg:w-12 flex flex-col justify-between items-end pr-2 lg:pr-3 pointer-events-none text-slate-500 text-[0.5rem] lg:text-xs font-bold font-mono z-20">
                            <span className="border-b border-slate-500 w-full text-right pr-1">500</span>
                            <span className="border-b border-slate-500 w-1/2" />
                            <span className="border-b border-slate-500 w-full text-right pr-1">300</span>
                            <span className="border-b border-slate-500 w-1/2" />
                            <span className="border-b border-slate-500 w-full text-right pr-1">100</span>
                        </div>
                    </div>

                    {/* Thermometer */}
                    <Thermometer temperature={temperature} className="mb-4" />
                </div>

                {/* Dropped Items List */}
                <div className="flex gap-2 flex-wrap justify-center max-w-2xl mx-auto">
                    <AnimatePresence>
                        {beakerContents.map((chem, idx) => (
                            <motion.div
                                key={`${chem.id}-${idx}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="px-2 lg:px-3 py-1 bg-white rounded-full text-[0.65rem] lg:text-xs text-slate-600 border border-slate-200 shadow-sm flex items-center gap-1 lg:gap-2"
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: chem.hexColor }}
                                />
                                {chem.name}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
