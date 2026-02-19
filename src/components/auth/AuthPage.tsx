'use client';

import { useState } from 'react';
import { login, register } from '@/actions/auth';
import { Atom, Loader2, Sparkles, Zap, FlaskConical, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage({ initialView = 'login' }: { initialView?: 'login' | 'register' }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLogin, setIsLogin] = useState(initialView === 'login');
    const [role, setRole] = useState<'STUDENT' | 'TEACHER' | 'PARENT'>('STUDENT');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            if (isLogin) {
                const result = await login(undefined, formData);
                if (result) {
                    setError(result);
                } else {
                    // Login successful, redirect handled by server action or we force it here?
                    // NextAuth signIn redirects by default. If we are here, maybe it didn't redirect or we caught error?
                    // Actually, if signIn succeeds, it redirects and throws NEXT_REDIRECT error which we rethrew in action.
                    // So we shouldn't reach here if success.
                    // But if we do, it might be due to credentials mismatch returned as string.
                    // Wait, my action returns string error.
                    // If success, it throws Redirect.
                }
            } else {
                const result = await register(undefined, formData);
                if (result === 'Success') {
                    alert('Signup successful! Please log in.');
                    setIsLogin(true);
                } else {
                    setError(result || 'Registration failed');
                }
            }
        } catch (err: unknown) {
            // NextRedirect error should be let through, but we are in client component.
            // Actually, calling server action from client component handles redirect automatically?
            // Yes, usually.
            // But if we caught it in `handleAuth`...
            // The action throws the error. `handleAuth` catches it?
            // No, `handleAuth` is async.
            // If I use `await login(...)`, and `login` throws Redirect, 
            // it should bubble up.
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <FlaskConical className="w-5 h-5" />, text: "Virtual Lab Simulations" },
        { icon: <Atom className="w-5 h-5" />, text: "3D Molecular Viewer" },
        { icon: <Zap className="w-5 h-5" />, text: "Daily Challenges" },
        { icon: <BookOpen className="w-5 h-5" />, text: "Rich Formula Bank" },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float delay-200" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl animate-bounce-subtle" />
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />

                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                <Atom className="w-8 h-8 animate-spin-slow" />
                            </div>
                            <span className="text-2xl font-bold">ChemMastery</span>
                        </div>

                        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                            Master Chemistry<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
                                Like Never Before
                            </span>
                        </h1>

                        <p className="text-lg text-indigo-100 mb-10 max-w-md">
                            Join thousands of students mastering molecular sciences through interactive labs and gamified learning.
                        </p>

                        {/* Feature Pills */}
                        <div className="space-y-3">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    className="flex items-center gap-3 text-indigo-100"
                                >
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        {feature.icon}
                                    </div>
                                    <span className="font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-center text-white">
                        <div className="mx-auto bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm">
                            <Atom className="w-7 h-7 animate-spin-slow" />
                        </div>
                        <h2 className="text-2xl font-bold">ChemMastery</h2>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-xs font-medium mb-3">
                                <Sparkles className="w-3 h-3" />
                                {isLogin ? 'Welcome back!' : 'Join us today'}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                                {isLogin ? 'Enter your credentials to continue' : 'Fill in the details to get started'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-5">
                            {!isLogin && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['STUDENT', 'TEACHER', 'PARENT'] as const).map((r) => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => setRole(r)}
                                                    className={`py-2.5 px-1 rounded-xl text-sm font-semibold capitalize border-2 transition-all ${role === r
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                                        }`}
                                                >
                                                    {r.toLowerCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Please wait...
                                    </>
                                ) : (
                                    isLogin ? 'Sign In →' : 'Create Account →'
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative bg-white px-4 text-sm text-slate-500">
                                    {isLogin ? "New to ChemMastery?" : "Already have an account?"}
                                </div>
                            </div>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="mt-4 text-indigo-600 font-bold hover:underline"
                            >
                                {isLogin ? 'Create an account' : 'Sign in instead'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
