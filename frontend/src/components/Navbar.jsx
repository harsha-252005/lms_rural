import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 px-6">
            <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-indigo-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter">
                        Rural<span className="text-indigo-400">LMS</span>
                    </span>
                </Link>

                {!isAuthPage && (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-slate-300 hover:text-white font-bold transition-colors px-4 py-2"
                        >
                            <LogIn size={18} />
                            <span>Login</span>
                        </Link>
                        <Link
                            to="/register/student"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                        >
                            <UserPlus size={18} />
                            <span>Get Started</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
