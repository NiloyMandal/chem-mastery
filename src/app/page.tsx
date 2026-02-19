import Link from 'next/link';
import { Microscope, GraduationCap, Users, ArrowRight, Atom, Beaker, Droplet } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-teal-900 text-white selection:bg-teal-400 selection:text-indigo-900 relative overflow-hidden">

      {/* Chemistry Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Molecules */}
        <div className="absolute top-20 left-10 animate-float opacity-20">
          <Atom className="w-24 h-24 text-teal-300" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed opacity-15" style={{ animationDelay: '2s' }}>
          <Atom className="w-32 h-32 text-cyan-400" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-float opacity-10" style={{ animationDelay: '4s' }}>
          <Atom className="w-28 h-28 text-blue-300" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed opacity-20" style={{ animationDelay: '1s' }}>
          <Beaker className="w-20 h-20 text-teal-400" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float opacity-15" style={{ animationDelay: '3s' }}>
          <Droplet className="w-16 h-16 text-cyan-300" />
        </div>

        {/* Molecular Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="molecule-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-teal-300" />
              <circle cx="30" cy="30" r="1.5" fill="currentColor" className="text-cyan-300" />
              <circle cx="70" cy="70" r="1.5" fill="currentColor" className="text-blue-300" />
              <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5" className="text-teal-400" />
              <line x1="50" y1="50" x2="70" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#molecule-pattern)" />
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
          <Atom className="w-4 h-4 text-teal-300 animate-spin-slow" />
          <span className="text-sm font-medium text-teal-100">Welcome to the Future of Chemistry</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-white to-purple-200 drop-shadow-lg">
          ChemMastery
        </h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed opacity-90">
          The ultimate platform for mastering molecular sciences. Interactive labs,
          real-time progress tracking, and gamified learning for the next generation of scientists.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-teal-500 text-indigo-900 font-bold rounded-full hover:bg-teal-400 transition-colors shadow-lg hover:shadow-teal-500/30"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Navigation Grid */}
      <main className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* Student Portal Card */}
          <Link href="/student" className="group">
            <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/20 active:scale-95">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-lg">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-teal-300 transition-colors">Student Portal</h2>
              <p className="text-slate-300 text-sm mb-4">
                Access your personalized dashboard, join daily challenges, and track your leaderboard status.
              </p>
              <div className="flex items-center text-teal-300 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Teacher/Admin Card */}
          <Link href="/admin" className="group">
            <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 active:scale-95">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">Admin Suite</h2>
              <p className="text-slate-300 text-sm mb-4">
                Manage batches, track student attendance, and monitor fee payments seamlessly.
              </p>
              <div className="flex items-center text-purple-300 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Manage Class <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Parent Portal Card */}
          <Link href="/parent" className="group">
            <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/20 active:scale-95">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-pink-300 transition-colors">Parents</h2>
              <p className="text-slate-300 text-sm mb-4">
                View your child&apos;s academic progress, attendance records, and upcoming PTM schedules.
              </p>
              <div className="flex items-center text-pink-300 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                View Progress <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>



        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-400 text-sm">
        <p>Made by Niloy with love ❤️</p>
      </footer>
    </div>
  );
}
