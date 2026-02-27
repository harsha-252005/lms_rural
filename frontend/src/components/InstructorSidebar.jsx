import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    GraduationCap,
    PlusCircle,
    FileText,
    ClipboardCheck
} from 'lucide-react';

const InstructorSidebar = () => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/instructor/dashboard' },
        { icon: <BookOpen size={20} />, label: 'Manage Courses', path: '/manage-courses' },
        { icon: <PlusCircle size={20} />, label: 'Create Course', path: '/create-course' },
        { icon: <FileText size={20} />, label: 'Assignments', path: '/instructor/assignments' },
        { icon: <ClipboardCheck size={20} />, label: 'Tests', path: '/instructor/tests' },
        { icon: <Users size={20} />, label: 'Students', path: '/instructor/students' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/instructor/settings' },
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <GraduationCap className="w-8 h-8 text-indigo-500" />
                    <span className="text-white font-bold text-xl">RuralLMS</span>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6">
                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default InstructorSidebar;
