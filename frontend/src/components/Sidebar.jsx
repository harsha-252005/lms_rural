import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Search,
    ClipboardList,
    User,
    LogOut,
    GraduationCap
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
        { icon: Search, label: 'Browse Courses', path: '/student/browse' },
        { icon: ClipboardList, label: 'Tests', path: '/student/tests' },
        { icon: User, label: 'Profile', path: '/student/profile' },
    ];

    const handleLogout = () => {
        console.log('Logging out...');
        // In a real app, clear tokens and redirect to login
        window.location.href = '/login';
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
            <div className="p-8 flex items-center gap-3">
                <div className="bg-indigo-500 p-2 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-black text-xl tracking-tight">
                    Rural<span className="text-indigo-400">LMS</span>
                </span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
