import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';

const DashboardNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.name || 'User';
    const userRole = user.role === 'INSTRUCTOR' ? 'Instructor' : 'Student';

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <header className="h-20 bg-slate-900 shadow-sm border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
            <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/5 w-96">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for courses, lessons..."
                    className="bg-transparent border-none outline-none text-slate-300 placeholder:text-slate-500 w-full text-sm"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-800"></div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white leading-none mb-1">{displayName}</p>
                        <p className="text-xs text-indigo-400 font-medium">{userRole}</p>
                    </div>
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-slate-800 shadow-lg">
                            <User className="w-6 h-6 text-white" />
                        </button>

                        {/* Simple Dropdown on hover */}
                        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                                Your Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                                Settings
                            </button>
                            <div className="h-[1px] bg-slate-800 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-400/10 transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;
