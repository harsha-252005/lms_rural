import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ArrowRight, PlayCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../utils/api';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchMyCourses(parsedUser.id);
        }
    }, []);

    const fetchMyCourses = async (studentId) => {
        try {
            const response = await api.get(`/students/${studentId}/my-courses`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex bg-[#0a0f1d] min-h-screen font-sans selection:bg-indigo-500/30 overflow-hidden text-white">
            <div className="hidden lg:block w-64">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
                <DashboardNavbar studentName={user?.name || 'Student'} />

                <main className="p-8 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl font-black mb-2 tracking-tight">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Courses</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Tracking your academic progress and achievements.</p>
                    </motion.div>

                    {isLoading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course, index) => (
                                <motion.div
                                    key={course.courseId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 group hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-colors"></div>

                                    <div className="flex items-start justify-between mb-6 relative z-10">
                                        <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                            <BookOpen className="text-indigo-400 w-6 h-6" />
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${course.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-6 group-hover:text-indigo-300 transition-colors line-clamp-2 min-h-[3.5rem]">
                                        {course.courseTitle}
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                                            <span>Path Progress</span>
                                            <span className="text-indigo-400">{course.progressPercentage}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-[2px]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.progressPercentage}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-indigo-600 rounded-2xl font-bold text-sm transition-all duration-300 border border-white/5 hover:border-transparent group/btn">
                                        <span>Continue Learning</span>
                                        <PlayCircle className="w-4 h-4 group-hover/btn:fill-white/20" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-[3rem]">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="text-slate-500 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
                            <p className="text-slate-500 mb-8 max-w-xs mx-auto">You haven&apos;t enrolled in any courses yet. Start your journey today!</p>
                            <button
                                onClick={() => window.location.href = '/student/dashboard'}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-xl shadow-indigo-500/20"
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyCourses;
