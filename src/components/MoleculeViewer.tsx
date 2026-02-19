'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, Html, Center, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RotateCw, Info, Layers, RefreshCcw, Maximize } from 'lucide-react';
import { MOLECULES, ELEMENTS, AtomData, BondData, getMoleculeKeys } from './molecularData';

// --- Reused Geometry & Materials for Performance ---
// Creating these outside the component prevents re-creation on every render
const atomGeometry = new THREE.SphereGeometry(1, 32, 32);
const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
const baseAtomMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
});

function Atom({
    pos,
    elem,
    explosion,
    isHovered,
    onHover
}: {
    pos: [number, number, number];
    elem: string;
    explosion: number;
    isHovered: boolean;
    onHover: (state: boolean) => void;
}) {
    const config = ELEMENTS[elem] || ELEMENTS['C'];
    const meshRef = useRef<THREE.Mesh>(null);

    // Smoothly animate position based on explosion factor
    useFrame((state, delta) => {
        if (meshRef.current) {
            const targetX = pos[0] * explosion;
            const targetY = pos[1] * explosion;
            const targetZ = pos[2] * explosion;

            // Linear interpolation for smooth movement
            meshRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 10);
        }
    });

    // Clone material to allow individual emissive states without affecting others
    const material = useMemo(() => {
        const mat = baseAtomMaterial.clone();
        mat.color.set(config.color);
        return mat;
    }, [config.color]);

    // Update emissive on hover
    useEffect(() => {
        if (material) {
            material.emissive.set(isHovered ? config.color : '#000000');
            material.emissiveIntensity = isHovered ? 0.8 : 0;
        }
    }, [isHovered, config.color, material]);

    return (
        <group>
            <mesh
                ref={meshRef}
                castShadow
                receiveShadow
                geometry={atomGeometry}
                material={material}
                scale={config.radius}
                onPointerOver={(e) => { e.stopPropagation(); onHover(true); }}
                onPointerOut={() => onHover(false)}
            />
            {isHovered && meshRef.current && (
                <Html position={[meshRef.current.position.x, meshRef.current.position.y + config.radius + 0.3, meshRef.current.position.z]} center distanceFactor={10} zIndexRange={[100, 0]}>
                    <div className="bg-slate-900/90 text-white text-xs font-bold px-2 py-1 rounded-md border border-white/20 whitespace-nowrap shadow-xl pointer-events-none">
                        {config.label}
                    </div>
                </Html>
            )}
        </group>
    );
}

function Bond({ start, end, explosion }: { start: [number, number, number]; end: [number, number, number], explosion: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Calculate exploded positions
            const s = new THREE.Vector3(...start).multiplyScalar(explosion);
            const e = new THREE.Vector3(...end).multiplyScalar(explosion);

            const direction = new THREE.Vector3().subVectors(e, s);
            const length = direction.length();

            // Position is midpoint
            const pos = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);

            // Orientation
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

            // Apply transforms smoothly
            meshRef.current.position.lerp(pos, delta * 10);
            meshRef.current.quaternion.slerp(quaternion, delta * 10);
            meshRef.current.scale.set(1, length, 1); // Scale Y to match length
        }
    });

    return (
        <mesh ref={meshRef} castShadow geometry={bondGeometry}>
            <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.5} />
        </mesh>
    );
}

// --- Renderer ---

function MoleculeRenderer({ data, explosion }: { data: { atoms: AtomData[]; bonds: BondData[] }, explosion: number }) {
    const [hoveredAtom, setHoveredAtom] = useState<number | null>(null);

    return (
        <group>
            <Center>
                {/* Render Atoms */}
                {data.atoms.map((atom, idx) => (
                    <Atom
                        key={`atom-${idx}`}
                        pos={atom.pos}
                        elem={atom.elem}
                        explosion={explosion}
                        isHovered={hoveredAtom === idx}
                        onHover={(hovering) => setHoveredAtom(hovering ? idx : null)}
                    />
                ))}

                {/* Render Bonds */}
                {data.bonds.map((bond, idx) => {
                    const start = data.atoms[bond[0]].pos;
                    const end = data.atoms[bond[1]].pos;
                    return <Bond key={`bond-${idx}`} start={start} end={end} explosion={explosion} />;
                })}
            </Center>
        </group>
    );
}

// --- UI Components ---

const Legend = ({ atoms }: { atoms: AtomData[] }) => {
    // Extract unique elements present in current molecule
    const uniqueElements = useMemo(() => {
        const elems = new Set(atoms.map(a => a.elem));
        return Array.from(elems).map(e => ELEMENTS[e] || ELEMENTS['C']);
    }, [atoms]);

    return (
        <div className="absolute bottom-4 left-4 z-10 backdrop-blur-md bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Legend</h3>
            <div className="flex flex-col gap-2">
                {uniqueElements.map((el) => (
                    <div key={el.label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: el.color }} />
                        <span className="text-xs text-slate-200">{el.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Viewer Component ---

export default function MoleculeViewer() {
    const [activeMolecule, setActiveMolecule] = useState<keyof typeof MOLECULES>('benzene');
    const [autoRotate, setAutoRotate] = useState(true);
    const [explosion, setExplosion] = useState(1); // 1 = normal, >1 = exploded
    const controlsRef = useRef<any>(null);

    const moleculeData = MOLECULES[activeMolecule];

    const handleResetCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 relative overflow-hidden">

            {/* Background Gradient for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10" />

            {/* --- TOP LEFT: Header & Selector --- */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-3 max-w-[200px] md:max-w-xs">
                <div className="backdrop-blur-xl bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 shadow-2xl">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Molecule Viewer
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    {getMoleculeKeys().map((key) => (
                        <button
                            key={key}
                            onClick={() => { setActiveMolecule(key); setExplosion(1); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border ${activeMolecule === key
                                ? 'bg-blue-600/20 border-blue-500 text-blue-100'
                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                                }`}
                        >
                            {MOLECULES[key].name}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- TOP RIGHT: Info --- */}
            <div className="absolute top-4 right-4 z-20 backdrop-blur-xl bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 shadow-xl min-w-[150px]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-mono font-bold">{moleculeData.formula}</span>
                    <Info className="w-4 h-4 text-blue-400" />
                </div>
                <div className="h-px bg-slate-700/50 w-full mb-2" />
                <div className="flex justify-between text-xs text-slate-400">
                    <span>Atoms: {moleculeData.atoms.length}</span>
                    <span>Bonds: {moleculeData.bonds.length}</span>
                </div>
            </div>

            {/* --- BOTTOM CONTROLS --- */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-4 items-end">

                {/* Explosion Slider */}
                <div className="backdrop-blur-md bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 shadow-lg flex items-center gap-3">
                    <Maximize className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Exploded View</label>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={explosion}
                            onChange={(e) => setExplosion(parseFloat(e.target.value))}
                            className="w-32 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleResetCamera}
                        className="p-3 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
                        title="Reset Camera"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`p-3 rounded-full border transition-all ${autoRotate
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400'
                            }`}
                        title="Toggle Auto-Rotate"
                    >
                        <RotateCw className={`w-5 h-5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                    </button>
                </div>
            </div>

            {/* --- BOTTOM LEFT: Legend --- */}
            <Legend atoms={moleculeData.atoms} />

            {/* --- 3D SCENE --- */}
            <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} castShadow color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />

                {/* Aesthetic Background Elements */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <MoleculeRenderer data={moleculeData} explosion={explosion} />
                </Float>

                <EffectComposer enableNormalPass={false}>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.5} radius={0.5} />
                </EffectComposer>

                <ContactShadows position={[0, -5, 0]} opacity={0.5} scale={30} blur={2.5} far={5} color="#000000" />
                <Environment preset="city" />

                <OrbitControls
                    ref={controlsRef}
                    autoRotate={autoRotate}
                    autoRotateSpeed={0.5}
                    minDistance={5}
                    maxDistance={30}
                    enablePan={false}
                />
            </Canvas>
        </div>
    );
}
