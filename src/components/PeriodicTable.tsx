'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    X,
    Thermometer,
    Droplet,
    Cloud,
    Snowflake,
    Search,
    ArrowLeft,
    Atom
} from 'lucide-react';
import { ELEMENTS, CATEGORIES, Element, getElectronegativityRange, getAtomicRadiusRange } from '@/data/periodic-table-data';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type ViewMode = 'categories' | 'electronegativity' | 'atomic-radius' | 'state';

// 🎨 NEW: Explicit Color Mapping to ensure visibility
// Adjusted keys to match periodic-table-data.ts
const CATEGORY_COLORS: Record<string, string> = {
    "alkali-metal": "bg-red-100 border-red-300 text-red-900",
    "alkaline-earth": "bg-orange-100 border-orange-300 text-orange-900",
    "transition": "bg-blue-100 border-blue-300 text-blue-900",
    "post-transition": "bg-indigo-100 border-indigo-300 text-indigo-900",
    "metalloid": "bg-teal-100 border-teal-300 text-teal-900",
    "nonmetal": "bg-green-100 border-green-300 text-green-900",
    "polyatomic-nonmetal": "bg-green-100 border-green-300 text-green-900",
    "diatomic-nonmetal": "bg-emerald-100 border-emerald-300 text-emerald-900",
    "halogen": "bg-cyan-100 border-cyan-300 text-cyan-900",
    "noble-gas": "bg-purple-100 border-purple-300 text-purple-900",
    "lanthanide": "bg-pink-100 border-pink-300 text-pink-900",
    "actinide": "bg-rose-100 border-rose-300 text-rose-900",
    "unknown": "bg-slate-100 border-slate-300 text-slate-700"
};

export default function PeriodicTable() {
    const router = useRouter();

    // State
    const [hovered, setHovered] = useState<Element | null>(null);
    const [selected, setSelected] = useState<Element | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('categories');
    const [temperature, setTemperature] = useState(298);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const activeElement = selected || hovered;
    const enRange = useMemo(() => getElectronegativityRange(), []);
    const arRange = useMemo(() => getAtomicRadiusRange(), []);

    const isMatch = (el: Element) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            el.name.toLowerCase().includes(query) ||
            el.symbol.toLowerCase().includes(query) ||
            el.number.toString().includes(query)
        );
    };

    const getStateAtTemp = (el: Element): 'solid' | 'liquid' | 'gas' => {
        if (!el.meltingPoint || !el.boilingPoint) return el.standardState || 'solid';
        if (temperature < el.meltingPoint) return 'solid';
        if (temperature < el.boilingPoint) return 'liquid';
        return 'gas';
    };

    // 🎨 UPDATED: Get Style with Fallback Colors
    const getElementStyle = (el: Element): string => {
        // Search Dimming
        if (searchQuery && !isMatch(el)) {
            return 'bg-slate-50 border-slate-100 opacity-20 grayscale';
        }

        // Category Filter Dimming
        if (categoryFilter && el.category !== categoryFilter) {
            return 'bg-slate-50 border-slate-100 opacity-30'; // Lighter fade for non-matches
        }

        switch (viewMode) {
            case 'electronegativity':
                return 'bg-white border-slate-200'; // Base style, color added via style prop
            case 'atomic-radius':
                return 'bg-white border-slate-200';
            case 'state':
                const state = getStateAtTemp(el);
                if (state === 'solid') return 'bg-slate-100 border-slate-300 text-slate-700';
                if (state === 'liquid') return 'bg-sky-200 border-sky-400 text-sky-900';
                return 'bg-rose-100 border-rose-300 text-rose-900'; // Gas
            default:
                // Use the new Color Map
                // normalizing the key to handle spaces or distinct naming conventions
                const key = el.category.replace(/\s+/g, '-').toLowerCase();
                return CATEGORY_COLORS[key] || CATEGORY_COLORS['unknown'];
        }
    };

    const getHeatmapStyle = (el: Element): React.CSSProperties => {
        if ((searchQuery && !isMatch(el)) || (categoryFilter && el.category !== categoryFilter)) return {};

        if (viewMode === 'electronegativity' && el.electronegativity) {
            const norm = (el.electronegativity - enRange.min) / (enRange.max - enRange.min);
            const hue = 240 - (norm * 240); // Blue to Red
            return { backgroundColor: `hsl(${hue}, 85%, 75%)`, borderColor: `hsl(${hue}, 85%, 50%)` };
        }
        if (viewMode === 'atomic-radius' && el.atomicRadius) {
            const norm = (el.atomicRadius - arRange.min) / (arRange.max - arRange.min);
            const hue = 140 - (norm * 140); // Green to Red
            return { backgroundColor: `hsl(${hue}, 80%, 75%)`, borderColor: `hsl(${hue}, 80%, 50%)` };
        }
        return {};
    };

    const handleElementClick = (el: Element) => {
        setSelected(selected?.number === el.number ? null : el);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-2 md:p-6 rounded-2xl shadow-xl text-slate-900 overflow-hidden font-sans">

            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Smart Periodic Table</h1>
                        <p className="text-slate-500 text-sm">Interactive Element Explorer</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full xl:w-auto">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-48 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full">
                                <X className="w-3 h-3 text-slate-400" />
                            </button>
                        )}
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden md:block" />

                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value as ViewMode)}
                        className="flex-grow md:flex-grow-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="categories">🎨 Categories</option>
                        <option value="electronegativity">⚡ Electronegativity</option>
                        <option value="atomic-radius">⭕ Atomic Radius</option>
                        <option value="state">🌡️ State at Temp</option>
                    </select>

                    {viewMode === 'state' && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <input
                                type="range" min="0" max="6000" value={temperature}
                                onChange={(e) => setTemperature(Number(e.target.value))}
                                className="w-24 md:w-32 accent-indigo-600 cursor-pointer"
                            />
                            <span className="text-sm font-mono font-bold text-slate-700 w-16 text-right">{temperature} K</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 🎨 FILTER BUTTONS / LEGEND */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
                {viewMode === 'categories' ? (
                    <div className="flex gap-1.5 flex-wrap">
                        {Object.keys(CATEGORIES).map(cat => {
                            // Helper to get color for the button
                            const catKey = cat.replace(/\s+/g, '-').toLowerCase();
                            const colorClass = CATEGORY_COLORS[catKey] || "bg-slate-100 border-slate-200";
                            // Extract just the background color for the dot
                            const bgOnly = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-slate-200';

                            return (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                                    className={cn(
                                        "pl-2 pr-3 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-2",
                                        categoryFilter === cat
                                            ? colorClass + " ring-1 ring-offset-1 ring-slate-400 scale-105"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    <span className={cn("w-2 h-2 rounded-full", categoryFilter === cat ? "bg-white/50" : bgOnly.replace('100', '400'))} />
                                    {CATEGORIES[cat as keyof typeof CATEGORIES]?.label}
                                </button>
                            );
                        })}
                        {categoryFilter && (
                            <button onClick={() => setCategoryFilter(null)} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-white hover:bg-slate-900">
                                Reset
                            </button>
                        )}
                    </div>
                ) : <div />}
                {/* Heatmap Legends */}
                {viewMode === 'electronegativity' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-100 shadow-sm text-xs">
                        <span className="font-medium text-slate-500">0.7</span>
                        <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[hsl(240,70%,75%)] via-[hsl(150,70%,75%)] to-[hsl(60,70%,75%)]" />
                        <span className="font-medium text-slate-500">4.0</span>
                    </div>
                )}
                {viewMode === 'atomic-radius' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-100 shadow-sm text-xs">
                        <span className="font-medium text-slate-500">Small</span>
                        <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[hsl(120,60%,75%)] via-[hsl(60,60%,75%)] to-[hsl(0,60%,75%)]" />
                        <span className="font-medium text-slate-500">Large</span>
                    </div>
                )}
                {viewMode === 'state' && (
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-white rounded-lg border border-slate-100 shadow-sm text-xs">
                        <span className="flex items-center gap-1"><Snowflake className="w-3 h-3 text-blue-500" /> Solid</span>
                        <span className="flex items-center gap-1"><Droplet className="w-3 h-3 text-cyan-500" /> Liquid</span>
                        <span className="flex items-center gap-1"><Cloud className="w-3 h-3 text-purple-500" /> Gas</span>
                    </div>
                )}
            </div>

            {/* Main Content Area - Updated to Column Layout */}
            <div className="flex flex-col flex-1 gap-4 min-h-0 relative">

                {/* Grid */}
                <div className="flex-1 overflow-auto pr-1 pb-4">
                    <div className="grid grid-cols-[repeat(18,minmax(1.8rem,1fr))] gap-1 auto-rows-[2rem] md:auto-rows-[2.4rem]">
                        {ELEMENTS.map((el) => {
                            const style = getElementStyle(el);
                            return (
                                <motion.button
                                    key={el.number}
                                    onClick={() => handleElementClick(el)}
                                    onMouseEnter={() => setHovered(el)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{
                                        gridColumn: el.col,
                                        gridRow: el.row,
                                        ...(viewMode === 'electronegativity' || viewMode === 'atomic-radius' ? getHeatmapStyle(el) : {})
                                    }}
                                    className={cn(
                                        "rounded-md border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative",
                                        style,
                                        selected?.number === el.number && "ring-2 ring-indigo-600 z-20 scale-110 shadow-xl",
                                        hovered?.number === el.number && !selected && "z-10 scale-110 shadow-lg brightness-95",
                                    )}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-[0.5rem] md:text-[0.6rem] font-mono absolute top-0.5 left-1 opacity-60">{el.number}</span>
                                    <span className="text-xs md:text-sm font-bold">{el.symbol}</span>
                                </motion.button>
                            );
                        })}

                        {/* 🎨 ADDED: Placeholders for Lanthanides/Actinides in the main grid */}
                        <div className="col-start-3 row-start-6 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-[0.6rem] text-slate-400">57-71</div>
                        <div className="col-start-3 row-start-7 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-[0.6rem] text-slate-400">89-103</div>
                    </div>
                </div>

                {/* Details Panel - Moved to Bottom */}
                <AnimatePresence>
                    {activeElement && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 overflow-hidden"
                        >
                            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

                                {/* Large Element Display */}
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-24 h-24 md:w-32 md:h-32 rounded-3xl flex flex-col items-center justify-center shadow-inner border-4 shrink-0",
                                        CATEGORY_COLORS[activeElement.category.replace(/\s+/g, '-').toLowerCase()] || "bg-slate-100"
                                    )}>
                                        <span className="text-4xl md:text-5xl font-black">{activeElement.symbol}</span>
                                        <span className="text-xs md:text-sm font-mono mt-1 font-semibold opacity-70">{activeElement.number}</span>
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-800">{activeElement.name}</h2>
                                        <p className="text-lg text-slate-500 font-mono mb-1">{activeElement.mass.toFixed(4)} u</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium capitalize">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{activeElement.category}</span>
                                            <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{activeElement.standardState}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Properties Grid */}
                                <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">

                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                                        <p className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-bold mb-1">Electron Config</p>
                                        <p className="font-mono text-sm text-indigo-600 font-medium">{activeElement.electronConfig}</p>
                                    </div>

                                    {/* New Oxidation States */}
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                                        <p className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-bold mb-1">Common Oxidation States</p>
                                        <div className="flex flex-wrap gap-1">
                                            {activeElement.oxidationStates && activeElement.oxidationStates.length > 0 ? (
                                                activeElement.oxidationStates.map((state) => (
                                                    <span key={state} className={cn(
                                                        "px-2 py-0.5 rounded text-xs font-bold border",
                                                        state > 0 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-red-50 text-red-700 border-red-200"
                                                    )}>
                                                        {state > 0 ? '+' : ''}{state}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unknown</span>
                                            )}
                                        </div>
                                    </div>

                                    <PropCard label="Electronegativity" value={activeElement.electronegativity || '-'} />
                                    <PropCard label="Radius" value={activeElement.atomicRadius ? `${activeElement.atomicRadius} pm` : '-'} />
                                    <PropCard label="Density" value={activeElement.density ? `${activeElement.density} g/cm³` : '-'} />
                                    <PropCard label="Melting Point" value={activeElement.meltingPoint ? `${activeElement.meltingPoint} K` : '-'} />
                                    <PropCard label="Boiling Point" value={activeElement.boilingPoint ? `${activeElement.boilingPoint} K` : '-'} />
                                    {activeElement.yearDiscovered && <PropCard label="Discovered" value={activeElement.yearDiscovered} />}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function PropCard({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm">
            <p className="text-[0.6rem] text-slate-400 uppercase font-bold">{label}</p>
            <p className="text-sm font-semibold text-slate-700 capitalize break-words">{value}</p>
        </div>
    );
}