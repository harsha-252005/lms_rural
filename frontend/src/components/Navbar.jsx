import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
            <div className="hidden sm:flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-96 group focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
                <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                <input
                    type="text"
                    placeholder="Search for courses, students, reports..."
                    className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full outline-none text-slate-600"
                />
            </div>

            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">John Doe</p>
                        <p className="text-xs text-slate-500">Instructor</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:ring-4 hover:ring-indigo-50 transition-all cursor-pointer">
                        <User size={24} className="text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 px-6">
            <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 flex justify-between items-center shadow-2xl">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tight hidden sm:block">
                        Rural<span className="text-indigo-400">LMS</span>
                    </span>
                </Link>

                <div className="flex gap-2 sm:gap-6 items-center">
                    <Link
                        to="/login"
                        className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-full flex items-center gap-2 ${location.pathname === '/login'
                                ? 'bg-white/10 text-white'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <LogIn className="w-4 h-4" />
                        <span className="hidden xs:block">Login</span>
                    </Link>

                    <Link
                        to="/register/student"
                        className="text-sm font-bold bg-white text-indigo-900 px-6 py-2 rounded-full hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Join Free</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
