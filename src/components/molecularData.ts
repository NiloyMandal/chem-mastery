// molecularData.ts - Data-driven molecular definitions with CPK standards

// 1. CPK Standard Colors & Radii (The "Chemistry Logic")
// Reference: https://en.wikipedia.org/wiki/CPK_coloring
export const ELEMENTS: Record<
  string,
  { color: string; radius: number; label: string }
> = {
  C: { color: "#333333", radius: 0.7, label: "Carbon" },
  H: { color: "#FFFFFF", radius: 0.35, label: "Hydrogen" },
  O: { color: "#F00000", radius: 0.6, label: "Oxygen" },
  N: { color: "#3050F8", radius: 0.65, label: "Nitrogen" },
  Cl: { color: "#1FF01F", radius: 0.75, label: "Chlorine" },
  S: { color: "#FFFF30", radius: 0.8, label: "Sulfur" },
  P: { color: "#FF8000", radius: 0.75, label: "Phosphorus" },
};

// 2. Type definitions for molecule data
export type AtomData = { elem: string; pos: [number, number, number] };
export type BondData = [number, number]; // Indices of [StartAtom, EndAtom]

export interface MoleculeData {
  name: string;
  formula: string;
  atoms: AtomData[];
  bonds: BondData[];
}

// 3. Molecule Definitions (scalable JSON-like structure)
export const MOLECULES: Record<string, MoleculeData> = {
  methane: {
    name: "Methane",
    formula: "CH₄",
    atoms: [
      { elem: "C", pos: [0, 0, 0] },
      { elem: "H", pos: [0.63, 0.63, 0.63] },
      { elem: "H", pos: [0.63, -0.63, -0.63] },
      { elem: "H", pos: [-0.63, 0.63, -0.63] },
      { elem: "H", pos: [-0.63, -0.63, 0.63] },
    ],
    bonds: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },

  water: {
    name: "Water",
    formula: "H₂O",
    atoms: [
      { elem: "O", pos: [0, 0, 0] },
      { elem: "H", pos: [0.75, -0.47, 0] },
      { elem: "H", pos: [-0.75, -0.47, 0] },
    ],
    bonds: [
      [0, 1],
      [0, 2],
    ],
  },

  benzene: {
    name: "Benzene",
    formula: "C₆H₆",
    atoms: [
      // Carbons (Ring) - generated from hexagon geometry
      { elem: "C", pos: [1.4, 0, 0] },
      { elem: "C", pos: [0.7, 1.21, 0] },
      { elem: "C", pos: [-0.7, 1.21, 0] },
      { elem: "C", pos: [-1.4, 0, 0] },
      { elem: "C", pos: [-0.7, -1.21, 0] },
      { elem: "C", pos: [0.7, -1.21, 0] },
      // Hydrogens (outer ring)
      { elem: "H", pos: [2.4, 0, 0] },
      { elem: "H", pos: [1.2, 2.1, 0] },
      { elem: "H", pos: [-1.2, 2.1, 0] },
      { elem: "H", pos: [-2.4, 0, 0] },
      { elem: "H", pos: [-1.2, -2.1, 0] },
      { elem: "H", pos: [1.2, -2.1, 0] },
    ],
    bonds: [
      // Ring C-C bonds
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      // C-H bonds
      [0, 6],
      [1, 7],
      [2, 8],
      [3, 9],
      [4, 10],
      [5, 11],
    ],
  },

  ammonia: {
    name: "Ammonia",
    formula: "NH₃",
    atoms: [
      { elem: "N", pos: [0, 0.2, 0] },
      { elem: "H", pos: [0.94, -0.4, 0] },
      { elem: "H", pos: [-0.47, -0.4, 0.81] },
      { elem: "H", pos: [-0.47, -0.4, -0.81] },
    ],
    bonds: [
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },

  ethanol: {
    name: "Ethanol",
    formula: "C₂H₅OH",
    atoms: [
      // C1 (CH3)
      { elem: "C", pos: [-1.2, 0, 0] },
      { elem: "H", pos: [-1.2, 0.9, 0] },
      { elem: "H", pos: [-1.7, -0.4, 0.8] },
      { elem: "H", pos: [-1.7, -0.4, -0.8] },
      // C2 (CH2)
      { elem: "C", pos: [0.2, 0, 0] },
      { elem: "H", pos: [0.2, -0.9, 0] },
      { elem: "H", pos: [0.2, 0.5, 0.9] },
      // O (OH)
      { elem: "O", pos: [1.0, 0.5, -0.5] },
      { elem: "H", pos: [1.8, 0.2, -0.2] },
    ],
    bonds: [
      // Backbone
      [0, 4], // C-C
      [4, 7], // C-O
      [7, 8], // O-H
      // C1-H bonds
      [0, 1],
      [0, 2],
      [0, 3],
      // C2-H bonds
      [4, 5],
      [4, 6],
    ],
  },

  carbonDioxide: {
    name: "Carbon Dioxide",
    formula: "CO₂",
    atoms: [
      { elem: "C", pos: [0, 0, 0] },
      { elem: "O", pos: [-1.16, 0, 0] },
      { elem: "O", pos: [1.16, 0, 0] },
    ],
    bonds: [
      [0, 1],
      [0, 2],
    ],
  },

  hydrogenPeroxide: {
    name: "Hydrogen Peroxide",
    formula: "H₂O₂",
    atoms: [
      { elem: "O", pos: [-0.7, 0, 0] },
      { elem: "O", pos: [0.7, 0, 0] },
      { elem: "H", pos: [-1.1, 0.5, 0.5] },
      { elem: "H", pos: [1.1, -0.5, -0.5] },
    ],
    bonds: [
      [0, 1],
      [0, 2],
      [1, 3],
    ],
  },
};

// Utility: Get molecule keys for UI
export const getMoleculeKeys = (): Array<keyof typeof MOLECULES> => {
  return Object.keys(MOLECULES) as Array<keyof typeof MOLECULES>;
};
