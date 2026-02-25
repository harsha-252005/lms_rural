import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    Layers,
    Plus,
    ArrowRight,
    GraduationCap
} from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import StatsCard from '../components/StatsCard';

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Instructor' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({ ...parsedUser, name: parsedUser.name || 'Instructor' });
            } catch (e) {
                console.error('Failed to parse user from localStorage', e);
            }
        }
    }, []);

    const stats = [
        { title: 'Total Courses', value: '12', description: 'from 10 last month', icon: BookOpen, trend: 20 },
        { title: 'Total Students', value: '1,284', description: 'from 1,100 last month', icon: Users, trend: 16.7 },
        { title: 'Active Courses', value: '8', description: 'currently live', icon: Layers, trend: 5 },
        { title: 'Total Lessons', value: '420', description: 'across all courses', icon: GraduationCap, trend: 12.5 },
    ];

    const recentEnrollments = [
        { id: 1, student: 'Alice Johnson', course: 'Organic Farming', date: '2024-03-20', progress: 45, status: 'Active' },
        { id: 2, student: 'Bob Smith', course: 'Solar Panel Maintenance', date: '2024-03-19', progress: 12, status: 'Active' },
        { id: 3, student: 'Charlie Davis', course: 'Water Management', date: '2024-03-18', progress: 85, status: 'Completed' },
        { id: 4, student: 'Diana Prince', course: 'Rural Finance', date: '2024-03-18', progress: 0, status: 'New' },
        { id: 5, student: 'Ethan Hunt', course: 'Sustainable Farming', date: '2024-03-17', progress: 28, status: 'Active' },
    ];

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar studentName={user.name} />

                <main className="p-8 pb-12 space-y-10 max-w-7xl mx-auto w-full">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                                Welcome, <span className="text-indigo-600">{user.name}!</span> 👋
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg font-medium">
                                {user.email ? `Logged in as ${user.email}` : 'Manage your educational content and students.'}
                            </p>
                        </motion.div>

                        <button onClick={() => navigate('/create-course')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group">
                            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            <span>Create New Course</span>
                        </button>
                    </header>

                    {/* Analytics Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <StatsCard key={idx} {...stat} />
                        ))}
                    </div>

                    {/* Recent Enrollments Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-800">Recent Enrollments</h3>
                            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 group">
                                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Enrollment Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentEnrollments.map((enrollment) => (
                                        <tr key={enrollment.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                        {enrollment.student.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{enrollment.student}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{enrollment.course}</td>
                                            <td className="px-6 py-4 text-slate-500">{enrollment.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${enrollment.progress}%` }}
                                                            className="h-full bg-indigo-600"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{enrollment.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${enrollment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    enrollment.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {enrollment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InstructorDashboard;
