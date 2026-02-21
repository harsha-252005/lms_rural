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
