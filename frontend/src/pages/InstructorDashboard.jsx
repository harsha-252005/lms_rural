import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Users,
    BookOpen,
    Layers,
    GraduationCap,
    Plus,
    ArrowRight
} from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import StatCard from '../components/StatCard';
import InstructorCourseCard from '../components/InstructorCourseCard';

const InstructorDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || 'Instructor';
    const userEmail = user.email || '';

    const [stats, setStats] = useState([
        { title: 'Total Students', value: '0', icon: <Users className="text-blue-500" />, trend: 'Live data' },
        { title: 'Active Courses', value: '0', icon: <BookOpen className="text-emerald-500" />, trend: 'Live data' },
        { title: 'Total Revenue', value: '₹0', icon: <Layers className="text-purple-500" />, trend: 'Calculated' }
    ]);

    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats
                const statsResponse = await axios.get(`http://localhost:8080/api/instructors/${user.id}/dashboard-stats`);
                const { totalCourses, totalStudents } = statsResponse.data;

                // Fetch recent courses
                const coursesResponse = await axios.get(`http://localhost:8080/api/courses/instructor/${user.id}`);
                const courses = coursesResponse.data;

                setStats([
                    { title: 'Total Students', value: totalStudents.toLocaleString(), icon: <Users className="text-blue-500" />, trend: 'Enrolled across all courses' },
                    { title: 'Active Courses', value: totalCourses.toString(), icon: <BookOpen className="text-emerald-500" />, trend: 'Created by you' },
                    { title: 'Total Revenue', value: `₹${(totalStudents * 100).toLocaleString()}`, icon: <Layers className="text-purple-500" />, trend: 'Estimated earnings' }
                ]);

                setRecentCourses(courses.slice(0, 4)); // Show top 4 recent
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user.id) {
            fetchDashboardData();
        }
    }, [user.id]);

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar />

                <main className="p-8 pb-12 space-y-10 max-w-7xl mx-auto w-full">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                                Welcome, <span className="text-indigo-600">{userName}!</span> 👋
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg font-medium">
                                {userEmail ? `Logged in as ${userEmail}` : 'Manage your educational content and students.'}
                            </p>
                        </motion.div>

                        <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group">
                            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            <span>Create New Course</span>
                        </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <StatCard key={idx} {...stat} />
                        ))}
                    </div>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">My Recent Courses</h2>
                            <button className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                <span>All Courses</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {recentCourses.length > 0 ? (
                                recentCourses.map(course => (
                                    <InstructorCourseCard key={course.id} course={course} />
                                ))
                            ) : (
                                <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                                    <p className="text-slate-500 font-medium">You haven't created any courses yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="bg-indigo-50 p-6 rounded-3xl">
                                <GraduationCap size={48} className="text-indigo-600" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Want to reach more rural students?</h3>
                                <p className="text-slate-500 max-w-lg">Our AI can help you translate your course into 12 local Indian languages for free. Expand your impact today.</p>
                            </div>
                            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all whitespace-nowrap">
                                Get Started
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default InstructorDashboard;
