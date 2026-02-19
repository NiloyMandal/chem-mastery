'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Pencil, Eraser, Undo, Redo, Trash2, Hexagon, Save, Type,
    ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point {
    x: number;
    y: number;
}

type BondKind = 'single' | 'double' | 'triple' | 'wedge' | 'dash';

interface Bond {
    start: Point;
    end: Point;
    type: BondKind;
}

interface AtomLabel {
    position: Point;
    label: string;
}

interface CanvasState {
    bonds: Bond[];
    atomLabels: AtomLabel[];
}

interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BOND_LENGTH = 50;
const SNAP_THRESHOLD = 15;
const ATOM_LABELS = ['C', 'H', 'O', 'N', 'S', 'P', 'Cl', 'Br', 'F', 'I'];

const ATOM_COLORS: Record<string, string> = {
    C: '#374151',  // gray-700
    H: '#9ca3af',  // gray-400
    O: '#dc2626',  // red-600
    N: '#2563eb',  // blue-600
    S: '#ca8a04',  // yellow-600
    P: '#ea580c',  // orange-600
    Cl: '#16a34a', // green-600
    Br: '#92400e', // amber-800
    F: '#059669',  // emerald-600
    I: '#7c3aed',  // violet-600
};

const ATOM_BG_COLORS: Record<string, string> = {
    C: '#f3f4f6',
    H: '#f9fafb',
    O: '#fef2f2',
    N: '#eff6ff',
    S: '#fefce8',
    P: '#fff7ed',
    Cl: '#f0fdf4',
    Br: '#fffbeb',
    F: '#ecfdf5',
    I: '#f5f3ff',
};

const DEFAULT_VIEWBOX: ViewBox = { x: 0, y: 0, width: 800, height: 600 };
const MIN_ZOOM = 200;
const MAX_ZOOM = 3000;

// ─── Utility Functions ───────────────────────────────────────────────────────

/** Point-to-line-segment distance for accurate eraser */
function pointToSegmentDist(p: Point, a: Point, b: Point): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** Find the nearest existing vertex in a list of bonds */
function findNearestVertex(pos: Point, bonds: Bond[], threshold: number): Point | null {
    let nearest: Point | null = null;
    let minDist = threshold;
    for (const bond of bonds) {
        for (const pt of [bond.start, bond.end]) {
            const d = Math.hypot(pt.x - pos.x, pt.y - pos.y);
            if (d < minDist) {
                minDist = d;
                nearest = pt;
            }
        }
    }
    return nearest;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function OrganicCanvas() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Canvas state with history
    const [state, setState] = useState<CanvasState>({ bonds: [], atomLabels: [] });
    const [history, setHistory] = useState<CanvasState[]>([]);
    const [future, setFuture] = useState<CanvasState[]>([]);

    // Drawing state
    const [currentStart, setCurrentStart] = useState<Point | null>(null);
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
    const [snappedPos, setSnappedPos] = useState<Point | null>(null);
    const [hoveredBondIdx, setHoveredBondIdx] = useState<number>(-1);
    const [hoveredLabelIdx, setHoveredLabelIdx] = useState<number>(-1);
    const [nearestVertex, setNearestVertex] = useState<Point | null>(null);

    // Tool state
    const [tool, setTool] = useState<'bond' | 'eraser' | 'label'>('bond');
    const [bondType, setBondType] = useState<BondKind>('single');
    const [selectedLabel, setSelectedLabel] = useState('C');

    // View transform
    const [viewBox, setViewBox] = useState<ViewBox>(DEFAULT_VIEWBOX);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState<{ x: number; y: number; vx: number; vy: number } | null>(null);

    const zoomPercent = Math.round((DEFAULT_VIEWBOX.width / viewBox.width) * 100);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const pushState = useCallback((newState: CanvasState) => {
        setHistory(prev => [...prev, state]);
        setFuture([]);
        setState(newState);
    }, [state]);

    const undo = useCallback(() => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setFuture(f => [...f, state]);
        setState(prev);
        setHistory(h => h.slice(0, -1));
        setCurrentStart(null);
    }, [history, state]);

    const redo = useCallback(() => {
        if (future.length === 0) return;
        const next = future[future.length - 1];
        setHistory(h => [...h, state]);
        setState(next);
        setFuture(f => f.slice(0, -1));
        setCurrentStart(null);
    }, [future, state]);

    const clear = useCallback(() => {
        if (state.bonds.length === 0 && state.atomLabels.length === 0) return;
        pushState({ bonds: [], atomLabels: [] });
        setCurrentStart(null);
    }, [state, pushState]);

    // ── SVG Coordinate Conversion ───────────────────────────────────────────

    const getSvgCoordinates = useCallback((e: React.MouseEvent | MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };
        return {
            x: (e.clientX - CTM.e) / CTM.a,
            y: (e.clientY - CTM.f) / CTM.d,
        };
    }, []);

    // ── Snap Logic ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (!currentStart) {
            setSnappedPos(null);
            return;
        }
        const dx = mousePos.x - currentStart.x;
        const dy = mousePos.y - currentStart.y;
        const angle = Math.atan2(dy, dx);
        const snapAngle = Math.round(angle / (Math.PI / 6)) * (Math.PI / 6);

        const raw: Point = {
            x: currentStart.x + Math.cos(snapAngle) * BOND_LENGTH,
            y: currentStart.y + Math.sin(snapAngle) * BOND_LENGTH,
        };

        // Snap to existing vertex if close
        const vertex = findNearestVertex(raw, state.bonds, SNAP_THRESHOLD);
        setSnappedPos(vertex ?? raw);
    }, [mousePos, currentStart, state.bonds]);

    // ── Hover detection for eraser ──────────────────────────────────────────

    useEffect(() => {
        if (tool !== 'eraser') {
            setHoveredBondIdx(-1);
            setHoveredLabelIdx(-1);
            return;
        }
        let closestBond = -1;
        let closestBondDist = SNAP_THRESHOLD;
        state.bonds.forEach((bond, idx) => {
            const d = pointToSegmentDist(mousePos, bond.start, bond.end);
            if (d < closestBondDist) {
                closestBondDist = d;
                closestBond = idx;
            }
        });

        let closestLabel = -1;
        let closestLabelDist = SNAP_THRESHOLD;
        state.atomLabels.forEach((label, idx) => {
            const d = Math.hypot(label.position.x - mousePos.x, label.position.y - mousePos.y);
            if (d < closestLabelDist) {
                closestLabelDist = d;
                closestLabel = idx;
            }
        });

        setHoveredBondIdx(closestBond);
        setHoveredLabelIdx(closestLabel);
    }, [mousePos, tool, state.bonds, state.atomLabels]);

    // ── Vertex proximity indicator (when not drawing) ───────────────────────

    useEffect(() => {
        if (tool !== 'bond' || currentStart) {
            setNearestVertex(null);
            return;
        }
        setNearestVertex(findNearestVertex(mousePos, state.bonds, SNAP_THRESHOLD));
    }, [mousePos, tool, currentStart, state.bonds]);

    // ── Keyboard Shortcuts ──────────────────────────────────────────────────

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Don't capture when typing in inputs
            if ((e.target as HTMLElement).tagName === 'INPUT') return;

            if (e.key === 'Escape') {
                setCurrentStart(null);
                return;
            }
            if (e.key === 'Delete') {
                clear();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redo();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
                return;
            }

            // Number keys for bond types
            if (!e.ctrlKey && !e.metaKey) {
                const bondMap: Record<string, BondKind> = {
                    '1': 'single', '2': 'double', '3': 'triple',
                    '4': 'wedge', '5': 'dash'
                };
                if (bondMap[e.key]) {
                    setTool('bond');
                    setBondType(bondMap[e.key]);
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo, clear]);

    // ── Event Handlers ──────────────────────────────────────────────────────

    const handleClick = (e: React.MouseEvent) => {
        if (isPanning) return;
        const coords = getSvgCoordinates(e);

        if (tool === 'eraser') {
            let newBonds = state.bonds;
            let newLabels = state.atomLabels;
            let changed = false;

            if (hoveredBondIdx >= 0) {
                newBonds = state.bonds.filter((_, i) => i !== hoveredBondIdx);
                changed = true;
            }
            if (hoveredLabelIdx >= 0) {
                newLabels = state.atomLabels.filter((_, i) => i !== hoveredLabelIdx);
                changed = true;
            }
            if (changed) {
                pushState({ bonds: newBonds, atomLabels: newLabels });
            }
            return;
        }

        if (tool === 'label') {
            // Snap to existing vertex
            const vertex = findNearestVertex(coords, state.bonds, SNAP_THRESHOLD);
            const pos = vertex ?? coords;
            pushState({ ...state, atomLabels: [...state.atomLabels, { position: pos, label: selectedLabel }] });
            return;
        }

        // Bond tool
        if (!currentStart) {
            const vertex = findNearestVertex(coords, state.bonds, SNAP_THRESHOLD);
            setCurrentStart(vertex ?? coords);
        } else {
            if (snappedPos) {
                pushState({ ...state, bonds: [...state.bonds, { start: currentStart, end: snappedPos, type: bondType }] });
                setCurrentStart(snappedPos);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const coords = getSvgCoordinates(e);
        setMousePos(coords);

        // Panning
        if (isPanning && panStart) {
            const dx = (e.clientX - panStart.x) * (viewBox.width / (containerRef.current?.clientWidth ?? 800));
            const dy = (e.clientY - panStart.y) * (viewBox.height / (containerRef.current?.clientHeight ?? 600));
            setViewBox(prev => ({ ...prev, x: panStart.vx - dx, y: panStart.vy - dy }));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Middle mouse or Space+Left for pan
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            e.preventDefault();
            setIsPanning(true);
            setPanStart({ x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y });
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (e.button === 1 || isPanning) {
            setIsPanning(false);
            setPanStart(null);
        }
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentStart(null);
    };

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const svg = svgRef.current;
        if (!svg) return;

        const CTM = svg.getScreenCTM();
        if (!CTM) return;
        const cursorX = (e.clientX - CTM.e) / CTM.a;
        const cursorY = (e.clientY - CTM.f) / CTM.d;

        const factor = e.deltaY > 0 ? 1.1 : 0.9;

        setViewBox(prev => {
            const newW = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.width * factor));
            const newH = Math.min(MAX_ZOOM * 0.75, Math.max(MIN_ZOOM * 0.75, prev.height * factor));
            const ratioW = newW / prev.width;
            const ratioH = newH / prev.height;
            return {
                x: cursorX - (cursorX - prev.x) * ratioW,
                y: cursorY - (cursorY - prev.y) * ratioH,
                width: newW,
                height: newH,
            };
        });
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // ── Actions ─────────────────────────────────────────────────────────────

    const addBenzeneRing = () => {
        const centerX = viewBox.x + viewBox.width / 2;
        const centerY = viewBox.y + viewBox.height / 2;
        const radius = 50;
        const newBonds: Bond[] = [];

        for (let i = 0; i < 6; i++) {
            const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
            newBonds.push({
                start: { x: centerX + Math.cos(a1) * radius, y: centerY + Math.sin(a1) * radius },
                end: { x: centerX + Math.cos(a2) * radius, y: centerY + Math.sin(a2) * radius },
                type: i % 2 === 0 ? 'double' : 'single',
            });
        }
        pushState({ ...state, bonds: [...state.bonds, ...newBonds] });
    };

    const resetView = () => setViewBox(DEFAULT_VIEWBOX);

    const zoomIn = () => {
        setViewBox(prev => ({
            x: prev.x + prev.width * 0.1,
            y: prev.y + prev.height * 0.1,
            width: Math.max(MIN_ZOOM, prev.width * 0.8),
            height: Math.max(MIN_ZOOM * 0.75, prev.height * 0.8),
        }));
    };

    const zoomOut = () => {
        setViewBox(prev => ({
            x: prev.x - prev.width * 0.1,
            y: prev.y - prev.height * 0.1,
            width: Math.min(MAX_ZOOM, prev.width * 1.2),
            height: Math.min(MAX_ZOOM * 0.75, prev.height * 1.2),
        }));
    };

    const exportSvg = () => {
        if (!svgRef.current) return;
        const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        // Add white background
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('width', '100%');
        bg.setAttribute('height', '100%');
        bg.setAttribute('fill', 'white');
        clone.insertBefore(bg, clone.firstChild);

        // Remove preview/cursor elements
        clone.querySelectorAll('[data-preview]').forEach(el => el.remove());

        const svgData = new XMLSerializer().serializeToString(clone);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'structure.svg';
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Bond Rendering ──────────────────────────────────────────────────────

    const renderBond = (bond: Bond, idx: number, isPreview = false) => {
        const dx = bond.end.x - bond.start.x;
        const dy = bond.end.y - bond.start.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const isHovered = tool === 'eraser' && hoveredBondIdx === idx && !isPreview;
        const strokeColor = isHovered ? '#ef4444' : (isPreview ? '#94a3b8' : '#1e293b');
        const strokeOpacity = isPreview ? 0.5 : (isHovered ? 0.8 : 1);
        const dashArray = isPreview ? '6,4' : undefined;

        const baseProps = {
            stroke: strokeColor,
            strokeOpacity,
            strokeLinecap: 'round' as const,
            strokeDasharray: dashArray,
        };

        if (bond.type === 'single') {
            return (
                <line key={idx}
                    x1={bond.start.x} y1={bond.start.y}
                    x2={bond.end.x} y2={bond.end.y}
                    strokeWidth="2.5" {...baseProps}
                />
            );
        }

        if (bond.type === 'double') {
            const offset = 2.5;
            return (
                <g key={idx}>
                    <line x1={bond.start.x + nx * offset} y1={bond.start.y + ny * offset}
                        x2={bond.end.x + nx * offset} y2={bond.end.y + ny * offset}
                        strokeWidth="2" {...baseProps} />
                    <line x1={bond.start.x - nx * offset} y1={bond.start.y - ny * offset}
                        x2={bond.end.x - nx * offset} y2={bond.end.y - ny * offset}
                        strokeWidth="2" {...baseProps} />
                </g>
            );
        }

        if (bond.type === 'triple') {
            const offset = 3.5;
            return (
                <g key={idx}>
                    <line x1={bond.start.x} y1={bond.start.y}
                        x2={bond.end.x} y2={bond.end.y}
                        strokeWidth="2" {...baseProps} />
                    <line x1={bond.start.x + nx * offset} y1={bond.start.y + ny * offset}
                        x2={bond.end.x + nx * offset} y2={bond.end.y + ny * offset}
                        strokeWidth="2" {...baseProps} />
                    <line x1={bond.start.x - nx * offset} y1={bond.start.y - ny * offset}
                        x2={bond.end.x - nx * offset} y2={bond.end.y - ny * offset}
                        strokeWidth="2" {...baseProps} />
                </g>
            );
        }

        if (bond.type === 'wedge') {
            const w = 6;
            const points = [
                `${bond.start.x},${bond.start.y}`,
                `${bond.end.x + nx * w},${bond.end.y + ny * w}`,
                `${bond.end.x - nx * w},${bond.end.y - ny * w}`,
            ].join(' ');
            return (
                <polygon key={idx} points={points}
                    fill={isHovered ? '#ef4444' : (isPreview ? '#94a3b8' : '#1e293b')}
                    fillOpacity={isPreview ? 0.4 : (isHovered ? 0.7 : 1)}
                    stroke="none"
                />
            );
        }

        if (bond.type === 'dash') {
            const segments = 7;
            const lines = [];
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const cx = bond.start.x + dx * t;
                const cy = bond.start.y + dy * t;
                const halfW = (t * 5) + 1;
                lines.push(
                    <line key={`${idx}-${i}`}
                        x1={cx + nx * halfW} y1={cy + ny * halfW}
                        x2={cx - nx * halfW} y2={cy - ny * halfW}
                        strokeWidth="1.5" {...baseProps}
                    />
                );
            }
            return <g key={idx}>{lines}</g>;
        }

        return null;
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-2xl shadow-xl overflow-hidden select-none">
            {/* ═══ Toolbar ═══ */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 flex gap-3 items-center flex-wrap">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mr-2">
                    <Hexagon className="w-5 h-5 text-blue-500" />
                    Structure Editor
                </h2>

                {/* Tool Buttons */}
                <div className="flex gap-0.5 border-r border-slate-200 pr-3">
                    <button
                        onClick={() => { setTool('bond'); setCurrentStart(null); }}
                        className={cn("p-2 rounded-lg transition-all duration-150 border-2",
                            tool === 'bond' ? "bg-blue-50 border-blue-300 text-blue-600 shadow-sm" : "border-transparent hover:bg-slate-100 text-slate-500")}
                        title="Draw Bond (1–5 to pick type)"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => { setTool('label'); setCurrentStart(null); }}
                        className={cn("p-2 rounded-lg transition-all duration-150 border-2",
                            tool === 'label' ? "bg-emerald-50 border-emerald-300 text-emerald-600 shadow-sm" : "border-transparent hover:bg-slate-100 text-slate-500")}
                        title="Add Atom Label"
                    >
                        <Type className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => { setTool('eraser'); setCurrentStart(null); }}
                        className={cn("p-2 rounded-lg transition-all duration-150 border-2",
                            tool === 'eraser' ? "bg-red-50 border-red-300 text-red-500 shadow-sm" : "border-transparent hover:bg-slate-100 text-slate-500")}
                        title="Eraser"
                    >
                        <Eraser className="w-4 h-4" />
                    </button>
                </div>

                {/* Bond Type Selector */}
                {tool === 'bond' && (
                    <div className="flex gap-0.5 border-r border-slate-200 pr-3">
                        {([
                            { type: 'single' as BondKind, label: '—', key: '1' },
                            { type: 'double' as BondKind, label: '=', key: '2' },
                            { type: 'triple' as BondKind, label: '≡', key: '3' },
                            { type: 'wedge' as BondKind, label: '▲', key: '4' },
                            { type: 'dash' as BondKind, label: '┄', key: '5' },
                        ]).map(({ type, label, key }) => (
                            <button
                                key={type}
                                onClick={() => setBondType(type)}
                                className={cn("px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150",
                                    bondType === type
                                        ? "bg-slate-800 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700")}
                                title={`${type} bond (${key})`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Label Selector */}
                {tool === 'label' && (
                    <div className="flex gap-0.5 border-r border-slate-200 pr-3 overflow-x-auto">
                        {ATOM_LABELS.map(label => (
                            <button
                                key={label}
                                onClick={() => setSelectedLabel(label)}
                                className={cn("px-2 py-1 rounded-md text-xs font-bold transition-all duration-150",
                                    selectedLabel === label
                                        ? "text-white shadow-sm"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200")}
                                style={selectedLabel === label ? { backgroundColor: ATOM_COLORS[label] ?? '#374151' } : undefined}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Structure Templates */}
                <div className="flex gap-1 border-r border-slate-200 pr-3">
                    <button onClick={addBenzeneRing}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Add Benzene Ring">
                        <Hexagon className="w-3.5 h-3.5" /> Benzene
                    </button>
                </div>

                {/* History */}
                <div className="flex gap-0.5">
                    <button onClick={undo} disabled={history.length === 0}
                        className={cn("p-2 rounded-lg transition-colors", history.length > 0 ? "hover:bg-slate-100 text-slate-600" : "text-slate-300 cursor-not-allowed")}
                        title="Undo (Ctrl+Z)">
                        <Undo className="w-4 h-4" />
                    </button>
                    <button onClick={redo} disabled={future.length === 0}
                        className={cn("p-2 rounded-lg transition-colors", future.length > 0 ? "hover:bg-slate-100 text-slate-600" : "text-slate-300 cursor-not-allowed")}
                        title="Redo (Ctrl+Shift+Z)">
                        <Redo className="w-4 h-4" />
                    </button>
                    <button onClick={clear}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        title="Clear All (Delete)">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="ml-auto flex items-center gap-1">
                    <button onClick={zoomIn} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="Zoom In">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-slate-400 w-10 text-center tabular-nums">{zoomPercent}%</span>
                    <button onClick={zoomOut} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="Zoom Out">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button onClick={resetView} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="Reset View">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <button onClick={exportSvg}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium shadow-sm transition-colors">
                        <Save className="w-3.5 h-3.5" /> Export SVG
                    </button>
                </div>
            </div>

            {/* ═══ Canvas Area ═══ */}
            <div
                ref={containerRef}
                className={cn(
                    "flex-1 relative",
                    isPanning ? "cursor-grabbing" :
                        tool === 'eraser' ? "cursor-pointer" :
                            tool === 'label' ? "cursor-cell" :
                                "cursor-crosshair"
                )}
                style={{ background: '#f8fafc' }}
            >
                <svg
                    ref={svgRef}
                    className="w-full h-full"
                    viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                    onClick={handleClick}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onContextMenu={handleRightClick}
                >
                    {/* Dot Grid Pattern */}
                    <defs>
                        <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="0.8" fill="#cbd5e1" fillOpacity="0.5" />
                        </pattern>
                    </defs>
                    <rect x={viewBox.x - 2000} y={viewBox.y - 2000}
                        width={viewBox.width + 4000} height={viewBox.height + 4000}
                        fill="url(#dotGrid)" />

                    {/* Bonds */}
                    {state.bonds.map((bond, idx) => renderBond(bond, idx))}

                    {/* Atom Labels */}
                    {state.atomLabels.map((atom, idx) => {
                        const color = ATOM_COLORS[atom.label] ?? '#374151';
                        const bgColor = ATOM_BG_COLORS[atom.label] ?? '#f3f4f6';
                        const isHovered = tool === 'eraser' && hoveredLabelIdx === idx;
                        return (
                            <g key={`label-${idx}`}>
                                <circle cx={atom.position.x} cy={atom.position.y} r="13"
                                    fill={isHovered ? '#fee2e2' : bgColor}
                                    stroke={isHovered ? '#ef4444' : color}
                                    strokeWidth="1.5"
                                    strokeOpacity={isHovered ? 0.8 : 0.4}
                                />
                                <text x={atom.position.x} y={atom.position.y + 4.5}
                                    textAnchor="middle" fontSize="12" fontWeight="700"
                                    fontFamily="ui-monospace, monospace"
                                    fill={isHovered ? '#ef4444' : color}>
                                    {atom.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Preview Bond */}
                    {currentStart && snappedPos && tool === 'bond' && (
                        <g data-preview="true">
                            {renderBond({ start: currentStart, end: snappedPos, type: bondType }, -1, true)}
                            <circle cx={snappedPos.x} cy={snappedPos.y} r="4"
                                fill="#3b82f6" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />
                        </g>
                    )}

                    {/* Active start point */}
                    {currentStart && (
                        <g data-preview="true">
                            <circle cx={currentStart.x} cy={currentStart.y} r="5"
                                fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.6" />
                        </g>
                    )}

                    {/* Snap-to-vertex indicator (when hovering near a vertex, not drawing) */}
                    {nearestVertex && !currentStart && tool === 'bond' && (
                        <g data-preview="true">
                            <circle cx={nearestVertex.x} cy={nearestVertex.y} r="7"
                                fill="none" stroke="#3b82f6" strokeWidth="1.5"
                                strokeDasharray="3,2" strokeOpacity="0.6" />
                        </g>
                    )}
                </svg>

                {/* Instructions Overlay */}
                <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 py-2.5 rounded-xl text-[11px] text-slate-400 shadow-sm pointer-events-none space-y-0.5">
                    <p><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Click</kbd> start/extend bond · <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Right-click</kbd> stop chain</p>
                    <p><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">1–5</kbd> bond types · <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Scroll</kbd> zoom · <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Alt+Drag</kbd> pan</p>
                    <p><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Ctrl+Z</kbd> undo · <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Ctrl+Shift+Z</kbd> redo</p>
                </div>

                {/* Zoom Badge */}
                {zoomPercent !== 100 && (
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 px-2 py-1 rounded-lg text-[11px] font-mono text-slate-400 shadow-sm pointer-events-none">
                        {zoomPercent}%
                    </div>
                )}
            </div>
        </div>
    );
}
