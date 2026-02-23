import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    BookOpen,
    FileText,
    Users,
    UserCircle,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Create Course', icon: PlusCircle, path: '/create-course' },
        { name: 'Manage Courses', icon: BookOpen, path: '/manage-courses' },
        { name: 'Add Lessons', icon: FileText, path: '/add-lessons' },
        { name: 'Enrollments', icon: Users, path: '/enrollments' },
        { name: 'Profile', icon: UserCircle, path: '/profile' },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-40 transition-all duration-300 lg:relative lg:translate-x-0"
                    >
                        <div className="h-full flex flex-col p-4">
                            <div className="flex items-center gap-3 mb-10 px-2 pt-2">
                                <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xl font-bold text-slate-800 tracking-tight">LearnFlow</span>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${isActive
                                                ? 'bg-slate-100 text-brand-primary font-semibold border-r-4 border-brand-primary shrink-0'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                    `}
                                    >
                                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => console.log('Logout clicked')}
                                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-200 group"
                                >
                                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
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
