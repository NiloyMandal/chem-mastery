'use client';

import Link from 'next/link';
import { FlaskConical, Hexagon, TestTube, Cuboid, Flame, Trophy, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import { handleLogout } from './actions';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

// ============================================
// DATA LAYER - Scalable & Easy to Maintain
// ============================================

const STATS_DATA = [
    {
        id: 'points',
        icon: <Trophy className="w-6 h-6" />,
        label: 'Total Points',
        value: '1,250',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'labs',
        icon: <TestTube className="w-6 h-6" />,
        label: 'Labs Completed',
        value: '12',
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        id: 'score',
        icon: <Target className="w-6 h-6" />,
        label: 'Average Score',
        value: '94%',
        gradient: 'from-purple-500 to-violet-600',
    },
];

const TOOLS_DATA = [
    {
        id: 'virtual-lab',
        section: 'labs',
        title: 'Virtual Lab',
        desc: 'Simulate reactions safely.',
        href: '/student/tools/chemistry-lab',
        icon: <TestTube className="w-6 h-6 text-white" />,
        gradient: 'from-blue-500 to-indigo-600',
        glow: 'shadow-blue-500/20',
    },
    {
        id: 'organic-canvas',
        section: 'labs',
        title: 'Organic Canvas',
        desc: 'Draw chemical structures.',
        href: '/student/tools/organic-canvas',
        icon: <Hexagon className="w-6 h-6 text-white" />,
        gradient: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-500/20',
    },
    {
        id: '3d-viewer',
        section: 'reference',
        title: '3D Molecules',
        desc: 'Visualize molecular geometry.',
        href: '/student/tools/molecule-viewer',
        icon: <Cuboid className="w-6 h-6 text-white" />,
        gradient: 'from-purple-500 to-violet-600',
        glow: 'shadow-purple-500/20',
    },
    {
        id: 'periodic-table',
        section: 'reference',
        title: 'Periodic Table',
        desc: 'Element properties & trends.',
        href: '/student/tools/periodic-table',
        icon: <FlaskConical className="w-6 h-6 text-white" />,
        gradient: 'from-indigo-500 to-blue-600',
        glow: 'shadow-indigo-500/20',
    },
];


// ============================================
// MAIN COMPONENT
// ============================================

export default function StudentDashboard() {
    const labTools = TOOLS_DATA.filter(t => t.section === 'labs');
    const refTools = TOOLS_DATA.filter(t => t.section === 'reference');

    return (
        <div className="min-h-screen bg-white p-6 font-sans text-slate-900">

            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-float delay-200" />
            </div>

            {/* Header */}
            <motion.header
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4"
            >
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 text-xs font-medium mb-2">
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                        Your Learning Hub
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Student Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Welcome back, Aspiring Chemist!</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/student/profile">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white font-bold shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-600 transition-all"
                        >
                            Profile
                        </motion.button>
                    </Link>
                    <form action={handleLogout}>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 bg-slate-700 rounded-full text-white font-bold shadow-lg hover:bg-slate-800 transition-all"
                        >
                            Logout
                        </motion.button>
                    </form>
                </div>
            </motion.header>

            {/* Stats Row - Data-Driven */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                {STATS_DATA.map(stat => (
                    <StatCard key={stat.id} {...stat} />
                ))}
            </motion.div>

            {/* Continue Learning Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-3xl mb-8 group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 animate-gradient" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" aria-hidden="true" />

                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-3 backdrop-blur-sm border border-white/10">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
                            In Progress
                        </div>
                        <h3 className="text-3xl font-bold mb-2">Acid-Base Titration</h3>
                        <p className="text-slate-300 mb-6 max-w-md">You&apos;re 75% through this module. Complete the final assessment to earn your badge.</p>

                        {/* Progress Bar */}
                        <div className="w-full max-w-xs bg-white/10 rounded-full h-2 mb-6" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
                            <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2 rounded-full" style={{ width: '75%' }} />
                        </div>

                        <Link href="/student/modules/acid-base-titration">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-xl shadow-black/20"
                            >
                                Resume Module →
                            </motion.button>
                        </Link>
                    </div>

                    {/* Decorative Elements */}
                    <div className="hidden md:block relative" aria-hidden="true">
                        <div className="w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl absolute -right-10 top-0" />
                        <div className="w-32 h-32 bg-gradient-to-br from-teal-500/40 to-cyan-500/40 rounded-2xl rotate-12 backdrop-blur-sm border border-white/10" />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Tools & Learning (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* Virtual Labs Section - Data-Driven */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/25" aria-hidden="true">
                                    <TestTube className="w-5 h-5" />
                                </span>
                                Virtual Labs
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {labTools.map(tool => (
                                    <ToolCard key={tool.id} {...tool} />
                                ))}
                            </div>
                        </section>

                        {/* Reference & Visualization Section - Data-Driven */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-xl shadow-lg shadow-purple-500/25" aria-hidden="true">
                                    <Cuboid className="w-5 h-5" />
                                </span>
                                Reference & Viz
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {refTools.map(tool => (
                                    <ToolCard key={tool.id} {...tool} />
                                ))}
                            </div>
                        </section>
                    </motion.div>

                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <UpcomingEvents />
                </motion.div>
            </div>
        </div>
    );
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

function StatCard({ icon, label, value, gradient }: {
    icon: ReactNode,
    label: string,
    value: string,
    gradient: string,
}) {
    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group cursor-pointer"
        >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg text-white group-hover:scale-110 transition-transform`} aria-hidden="true">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </motion.div>
    );
}

function ToolCard({ href, icon, gradient, title, desc, glow }: {
    href: string,
    icon: ReactNode,
    gradient: string,
    title: string,
    desc: string,
    glow: string,
}) {
    return (
        <Link href={href} className="group">
            <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl ${glow} transition-all h-full flex items-start gap-4`}
            >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`} aria-hidden="true">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-lg">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">{desc}</p>
                </div>
            </motion.div>
        </Link>
    );
}
