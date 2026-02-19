'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Save, X, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    // Mock user data - in production this would come from session/database
    const [name, setName] = useState('John Student');
    const [email] = useState('student@test.com'); // Email is read-only
    const [bio, setBio] = useState('Passionate chemistry student exploring the molecular world.');

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempBio, setTempBio] = useState(bio);

    const handleSave = () => {
        setName(tempName);
        setBio(tempBio);
        setIsEditing(false);
        // In production, this would call a server action to update the database
    };

    const handleCancel = () => {
        setTempName(name);
        setTempBio(bio);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 font-sans text-slate-900">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-float delay-200" />
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/student" className="inline-flex items-center text-slate-600 hover:text-indigo-600 mb-6 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                >
                    {/* Header Section with Gradient */}
                    <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                    </div>

                    {/* Profile Picture */}
                    <div className="relative px-8 -mt-16 mb-6">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors group">
                                <Camera className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                            </button>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="px-8 pb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-1">{name}</h1>
                                <p className="text-slate-500 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {email}
                                </p>
                            </div>
                            {!isEditing && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-600 transition-all"
                                >
                                    Edit Profile
                                </motion.button>
                            )}
                        </div>

                        {/* Editable Fields */}
                        <div className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your name"
                                    />
                                ) : (
                                    <p className="text-lg text-slate-900 px-4 py-3 bg-slate-50 rounded-xl">{name}</p>
                                )}
                            </div>

                            {/* Email Field (Read-only) */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </label>
                                <p className="text-lg text-slate-500 px-4 py-3 bg-slate-100 rounded-xl cursor-not-allowed">
                                    {email}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Email cannot be changed for security reasons</p>
                            </div>

                            {/* Bio Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    About / Bio
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={tempBio}
                                        onChange={(e) => setTempBio(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-slate-700 px-4 py-3 bg-slate-50 rounded-xl whitespace-pre-wrap">{bio}</p>
                                )}
                            </div>

                            {/* Action Buttons (shown when editing) */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCancel}
                                        className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Additional Info Section */}
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                    <p className="text-sm text-slate-600 mb-1">Role</p>
                                    <p className="text-lg font-bold text-indigo-600">Student</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                    <p className="text-sm text-slate-600 mb-1">Member Since</p>
                                    <p className="text-lg font-bold text-purple-600">January 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
