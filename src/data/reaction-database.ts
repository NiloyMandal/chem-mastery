// Reaction Database - Scalable Lookup Table for Chemistry Lab
// Add new reactions here without modifying component logic

export type ChemicalType = 'acid' | 'base' | 'neutral' | 'indicator' | 'metal' | 'salt';

export interface Chemical {
    id: string;
    name: string;
    type: ChemicalType;
    color: string;
    hexColor: string; // For color mixing
    formula: string;
    state: 'liquid' | 'solid';
    phValue: number; // For pH calculations
}

export interface ReactionResult {
    equation?: string;
    description: string;
    resultColor?: string;
    resultHex?: string;
    bubbles?: boolean;
    precipitate?: 'white' | 'brown' | 'blue' | 'green' | 'yellow';
    heat?: number; // Temperature increase in Celsius
    phChange?: number; // Resulting pH
    consumesSolids?: boolean;
    safetyWarning?: string;
}

// Chemical Database with extended properties
export const CHEMICALS: Chemical[] = [
    // Acids
    { id: 'hcl', name: 'Hydrochloric Acid', type: 'acid', color: 'bg-red-500', hexColor: '#ef4444', formula: 'HCl', state: 'liquid', phValue: 1 },
    { id: 'h2so4', name: 'Sulfuric Acid', type: 'acid', color: 'bg-orange-500', hexColor: '#f97316', formula: 'H₂SO₄', state: 'liquid', phValue: 0.5 },
    { id: 'ch3cooh', name: 'Acetic Acid', type: 'acid', color: 'bg-yellow-400', hexColor: '#facc15', formula: 'CH₃COOH', state: 'liquid', phValue: 4 },
    { id: 'hno3', name: 'Nitric Acid', type: 'acid', color: 'bg-amber-500', hexColor: '#f59e0b', formula: 'HNO₃', state: 'liquid', phValue: 1 },

    // Bases
    { id: 'naoh', name: 'Sodium Hydroxide', type: 'base', color: 'bg-blue-600', hexColor: '#2563eb', formula: 'NaOH', state: 'liquid', phValue: 14 },
    { id: 'koh', name: 'Potassium Hydroxide', type: 'base', color: 'bg-indigo-600', hexColor: '#4f46e5', formula: 'KOH', state: 'liquid', phValue: 14 },
    { id: 'nh3', name: 'Ammonia', type: 'base', color: 'bg-blue-400', hexColor: '#60a5fa', formula: 'NH₃', state: 'liquid', phValue: 11 },
    { id: 'caoh2', name: 'Calcium Hydroxide', type: 'base', color: 'bg-slate-300', hexColor: '#cbd5e1', formula: 'Ca(OH)₂', state: 'liquid', phValue: 12 },

    // Indicators
    { id: 'phenolphthalein', name: 'Phenolphthalein', type: 'indicator', color: 'bg-pink-200', hexColor: '#fbcfe8', formula: 'C₂₀H₁₄O₄', state: 'liquid', phValue: 7 },
    { id: 'universal', name: 'Universal Indicator', type: 'indicator', color: 'bg-green-500', hexColor: '#22c55e', formula: 'Mix', state: 'liquid', phValue: 7 },
    { id: 'litmus', name: 'Litmus Solution', type: 'indicator', color: 'bg-purple-400', hexColor: '#a855f7', formula: 'Litmus', state: 'liquid', phValue: 7 },

    // Salts
    { id: 'agno3', name: 'Silver Nitrate', type: 'salt', color: 'bg-slate-200', hexColor: '#e2e8f0', formula: 'AgNO₃', state: 'liquid', phValue: 7 },
    { id: 'nacl', name: 'Sodium Chloride', type: 'salt', color: 'bg-white', hexColor: '#ffffff', formula: 'NaCl', state: 'liquid', phValue: 7 },
    { id: 'cuso4', name: 'Copper Sulfate', type: 'salt', color: 'bg-blue-500', hexColor: '#3b82f6', formula: 'CuSO₄', state: 'liquid', phValue: 4 },

    // Neutrals
    { id: 'water', name: 'Distilled Water', type: 'neutral', color: 'bg-blue-100', hexColor: '#dbeafe', formula: 'H₂O', state: 'liquid', phValue: 7 },

    // Metals (Solids)
    { id: 'zn', name: 'Zinc Granules', type: 'metal', color: 'bg-slate-400', hexColor: '#94a3b8', formula: 'Zn', state: 'solid', phValue: 7 },
    { id: 'cu', name: 'Copper Turnings', type: 'metal', color: 'bg-orange-700', hexColor: '#c2410c', formula: 'Cu', state: 'solid', phValue: 7 },
    { id: 'fe', name: 'Iron Filings', type: 'metal', color: 'bg-slate-600', hexColor: '#475569', formula: 'Fe', state: 'solid', phValue: 7 },
    { id: 'mg', name: 'Magnesium Ribbon', type: 'metal', color: 'bg-slate-300', hexColor: '#cbd5e1', formula: 'Mg', state: 'solid', phValue: 7 },
    { id: 'k', name: 'Potassium (Danger!)', type: 'metal', color: 'bg-violet-400', hexColor: '#a78bfa', formula: 'K', state: 'solid', phValue: 7 },

    // 🌟 NEW CHEMICALS 🌟
    { id: 'al', name: 'Aluminum Foil', type: 'metal', color: 'bg-slate-300', hexColor: '#cbd5e1', formula: 'Al', state: 'solid', phValue: 7 },
    { id: 'pbno32', name: 'Lead Nitrate', type: 'salt', color: 'bg-white', hexColor: '#ffffff', formula: 'Pb(NO₃)₂', state: 'solid', phValue: 5 },
    { id: 'ki', name: 'Potassium Iodide', type: 'salt', color: 'bg-white', hexColor: '#ffffff', formula: 'KI', state: 'solid', phValue: 7 },
    { id: 'nahco3', name: 'Baking Soda', type: 'base', color: 'bg-white', hexColor: '#ffffff', formula: 'NaHCO₃', state: 'solid', phValue: 8.5 },
];

// Reaction Database - Lookup by sorted chemical IDs
export const REACTION_DATABASE: Record<string, ReactionResult> = {
    // Precipitation Reactions
    'agno3+nacl': {
        equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
        description: 'Precipitation Reaction: White precipitate of Silver Chloride forms instantly.',
        resultColor: 'bg-white',
        resultHex: '#ffffff',
        precipitate: 'white',
        phChange: 7,
    },

    // Metal Displacement - Zinc
    'hcl+zn': {
        equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
        description: 'Displacement Reaction: Zinc displaces Hydrogen. Vigorous bubbling as H₂ gas is released.',
        resultColor: 'bg-slate-200',
        resultHex: '#e2e8f0',
        bubbles: true,
        heat: 40,
        consumesSolids: true,
        phChange: 5,
    },
    'h2so4+zn': {
        equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑',
        description: 'Displacement Reaction: Zinc reacts with sulfuric acid. Hydrogen gas bubbles released.',
        resultColor: 'bg-slate-200',
        resultHex: '#e2e8f0',
        bubbles: true,
        heat: 45,
        consumesSolids: true,
        phChange: 4,
    },

    // Metal Displacement - Magnesium (more vigorous)
    'hcl+mg': {
        equation: 'Mg + 2HCl → MgCl₂ + H₂↑',
        description: 'Vigorous Reaction! Magnesium reacts rapidly with acid. Intense bubbling and heat.',
        resultColor: 'bg-slate-100',
        resultHex: '#f1f5f9',
        bubbles: true,
        heat: 60,
        consumesSolids: true,
        phChange: 6,
    },
    'h2so4+mg': {
        equation: 'Mg + H₂SO₄ → MgSO₄ + H₂↑',
        description: 'Vigorous Reaction! Magnesium burns with sulfuric acid. Very hot!',
        resultColor: 'bg-slate-100',
        resultHex: '#f1f5f9',
        bubbles: true,
        heat: 65,
        consumesSolids: true,
        phChange: 5,
    },

    // Iron Reactions
    'cuso4+fe': {
        equation: 'Fe + CuSO₄ → FeSO₄ + Cu↓',
        description: 'Single Displacement: Iron displaces Copper. Brown copper metal deposits on iron surface.',
        resultColor: 'bg-green-200',
        resultHex: '#bbf7d0',
        precipitate: 'brown',
        phChange: 4,
    },

    // Copper - No reaction with dilute acids
    'cu+hcl': {
        equation: 'Cu + HCl → No Reaction',
        description: 'No Reaction: Copper is below Hydrogen in the reactivity series.',
        resultColor: 'bg-red-200',
        resultHex: '#fecaca',
        phChange: 1,
    },

    // Neutralization Reactions
    'hcl+naoh': {
        equation: 'HCl + NaOH → NaCl + H₂O',
        description: 'Neutralization: Forming common salt (NaCl) and water. Heat is released.',
        resultColor: 'bg-green-100',
        resultHex: '#dcfce7',
        heat: 25,
        phChange: 7,
    },
    'h2so4+naoh': {
        equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
        description: 'Neutralization: Sodium sulfate and water formed. Exothermic reaction.',
        resultColor: 'bg-green-100',
        resultHex: '#dcfce7',
        heat: 30,
        phChange: 7,
    },
    'ch3cooh+naoh': {
        equation: 'CH₃COOH + NaOH → CH₃COONa + H₂O',
        description: 'Neutralization: Forming sodium acetate (soap!) and water.',
        resultColor: 'bg-lime-100',
        resultHex: '#ecfccb',
        heat: 15,
        phChange: 7,
    },
    'hcl+koh': {
        equation: 'HCl + KOH → KCl + H₂O',
        description: 'Neutralization: Forming potassium chloride and water.',
        resultColor: 'bg-green-100',
        resultHex: '#dcfce7',
        heat: 20,
        phChange: 7,
    },
    'hcl+nh3': {
        equation: 'HCl + NH₃ → NH₄Cl',
        description: 'Salt Formation: White fumes of ammonium chloride formed!',
        resultColor: 'bg-white',
        resultHex: '#ffffff',
        heat: 10,
        phChange: 5,
    },

    // Dangerous Reactions - Potassium
    'k+water': {
        equation: 'K + H₂O → KOH + H₂↑ + 💥',
        description: '🔥 DANGER! Potassium reacts violently with water! Explosion and fire!',
        resultColor: 'bg-red-500',
        resultHex: '#ef4444',
        bubbles: true,
        heat: 90,
        safetyWarning: 'EXPLOSION! Never add alkali metals directly to water!',
        consumesSolids: true,
        phChange: 14,
    },

    // Copper Sulfate Reactions
    'cuso4+naoh': {
        equation: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
        description: 'Precipitation: Light blue gelatinous precipitate of Copper Hydroxide forms.',
        resultColor: 'bg-cyan-300',
        resultHex: '#67e8f9',
        precipitate: 'blue',
        phChange: 9,
    },

    // Indicator + Acid
    'hcl+universal': {
        equation: 'pH Test',
        description: 'Universal Indicator turns RED in strong acid (pH ~1).',
        resultColor: 'bg-red-600',
        resultHex: '#dc2626',
        phChange: 1,
    },
    'ch3cooh+universal': {
        equation: 'pH Test',
        description: 'Universal Indicator turns ORANGE in weak acid (pH ~4).',
        resultColor: 'bg-orange-500',
        resultHex: '#f97316',
        phChange: 4,
    },
    'naoh+universal': {
        equation: 'pH Test',
        description: 'Universal Indicator turns PURPLE in strong base (pH ~14).',
        resultColor: 'bg-purple-700',
        resultHex: '#7c3aed',
        phChange: 14,
    },
    'nh3+universal': {
        equation: 'pH Test',
        description: 'Universal Indicator turns BLUE in weak base (pH ~11).',
        resultColor: 'bg-blue-600',
        resultHex: '#2563eb',
        phChange: 11,
    },

    // Indicator + Base (Phenolphthalein)
    'naoh+phenolphthalein': {
        equation: 'pH Indicator Test',
        description: 'Phenolphthalein turns PINK in basic solution!',
        resultColor: 'bg-pink-500',
        resultHex: '#ec4899',
        phChange: 14,
    },
    'hcl+phenolphthalein': {
        equation: 'pH Indicator Test',
        description: 'Phenolphthalein remains COLORLESS in acidic solution.',
        resultColor: 'bg-white/50',
        resultHex: '#f8fafc',
        phChange: 1,
    },

    // 🌟 NEW REACTIONS 🌟

    // Golden Rain (Pb(NO3)2 + KI)
    'ki+pbno32': {
        equation: 'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',
        description: 'Golden Rain! Yellow precipitate of Lead Iodide forms.',
        resultColor: 'bg-yellow-400',
        resultHex: '#facc15', // Yellow solution
        precipitate: 'yellow',
        safetyWarning: 'Lead compounds are toxic! Wash hands.',
    },

    // Baking Soda Volcano (NaHCO3 + Vinegar/Acid)
    'ch3cooh+nahco3': {
        equation: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑',
        description: 'Volcano Effect! Baking soda reacts with vinegar to release CO₂ gas.',
        resultColor: 'bg-white',
        resultHex: '#ffffff',
        bubbles: true,
        consumesSolids: true,
        heat: 15, // Endothermic actually, but let's say slight change or 15 (cool)
        phChange: 7,
    },
    'hcl+nahco3': {
        equation: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',
        description: 'Fizz! Sodium bicarbonate reacts with acid.',
        resultColor: 'bg-slate-50',
        resultHex: '#f8fafc',
        bubbles: true,
        consumesSolids: true,
        phChange: 7,
    },

    // Aluminum Reactions
    'al+hcl': {
        equation: '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
        description: 'Aluminum dissolves in acid releasing Hydrogen gas. Exothermic!',
        resultColor: 'bg-slate-200',
        resultHex: '#e2e8f0',
        bubbles: true,
        heat: 50,
        consumesSolids: true,
        phChange: 3,
    },
    'al+naoh': {
        equation: '2Al + 2NaOH + 6H₂O → 2NaAl(OH)₄ + 3H₂↑',
        description: 'Aluminum reacts with strong base (Amphoteric nature)!',
        resultColor: 'bg-slate-200',
        resultHex: '#e2e8f0',
        bubbles: true,
        heat: 55,
        consumesSolids: true,
        phChange: 12,
    },
    'al+cu': {
        // No reaction typical solid-solid without heat, but maybe displacement if solution?
        // This key would be only if mixed. Usually need solution.
        // Let's do Al + CuSO4 (solution)
        // BUT reaction keys are sorted IDs. So if I have 'al' and 'cuso4' in beaker.
        // Existing logic takes IDs. 
        // Let's add 'al+cuso4'
        equation: 'No Reaction (Solids)',
        description: 'Solids do not react without heat.',
    },
    'al+cuso4': {
        equation: '2Al + 3CuSO₄ → Al₂(SO₄)₃ + 3Cu↓',
        description: 'Displacement: Aluminum displaces Copper from solution.',
        resultColor: 'bg-blue-100', // Fades
        resultHex: '#dbeafe',
        precipitate: 'brown', // Copper
        consumesSolids: true, // Al consumed
        heat: 40,
    },
};

// Helper function to create reaction key from chemical IDs
export function getReactionKey(chemicalIds: string[]): string {
    return chemicalIds
        .filter(id => id !== 'water') // Water usually doesn't change reaction key
        .sort()
        .join('+');
}

// Simple color mixing (hex to RGB and back)
export function mixColors(hexColors: string[]): string {
    if (hexColors.length === 0) return '#dbeafe'; // Default water blue
    if (hexColors.length === 1) return hexColors[0];

    // Convert hex to RGB, average, convert back
    const rgbColors = hexColors.map(hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        } : { r: 219, g: 234, b: 254 }; // Fallback
    });

    const avgR = Math.round(rgbColors.reduce((sum, c) => sum + c.r, 0) / rgbColors.length);
    const avgG = Math.round(rgbColors.reduce((sum, c) => sum + c.g, 0) / rgbColors.length);
    const avgB = Math.round(rgbColors.reduce((sum, c) => sum + c.b, 0) / rgbColors.length);

    return `rgb(${avgR}, ${avgG}, ${avgB})`;
}

// Calculate average pH
export function calculatePH(chemicals: Chemical[]): number {
    if (chemicals.length === 0) return 7;
    const total = chemicals.reduce((sum, c) => sum + c.phValue, 0);
    return total / chemicals.length;
}
