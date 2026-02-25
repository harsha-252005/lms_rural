import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle,
    Clock,
    TrendingUp,
    Globe,
    Rocket,
    PlayCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../utils/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "Student" });
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({ ...parsedUser, name: parsedUser.name || "Student" });
                fetchData(parsedUser.id);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchData = async (studentId) => {
        try {
            const [coursesRes, allCoursesRes] = await Promise.all([
                api.get(`/students/${studentId}/my-courses`),
                api.get('/courses')
            ]);
            setEnrolledCourses(coursesRes.data || []);
            setAvailableCourses(allCoursesRes.data || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Compute real stats
    const totalEnrolled = enrolledCourses.length;
    const completedCount = enrolledCourses.filter(c => c.status === 'COMPLETED').length;
    const inProgressCount = enrolledCourses.filter(c => c.status === 'ENROLLED').length;
    const avgProgress = totalEnrolled > 0
        ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) / totalEnrolled)
        : 0;

    const stats = [
        {
            title: "Enrolled Courses",
            value: String(totalEnrolled).padStart(2, '0'),
            icon: BookOpen,
            description: "Total courses joined",
            gradient: "from-blue-600 to-indigo-600",
            trend: `${inProgressCount} active`
        },
        {
            title: "Completed",
            value: String(completedCount).padStart(2, '0'),
            icon: CheckCircle,
            description: "Finished certifications",
            gradient: "from-emerald-600 to-teal-600",
            trend: totalEnrolled > 0 ? `${Math.round((completedCount / totalEnrolled) * 100)}% completion` : "0%"
        },
        {
            title: "In Progress",
            value: String(inProgressCount).padStart(2, '0'),
            icon: Clock,
            description: "Currently learning",
            gradient: "from-amber-600 to-orange-600",
            trend: "Keep going!"
        },
        {
            title: "Avg Progress",
            value: `${avgProgress}%`,
            icon: TrendingUp,
            description: "Overall progress",
            gradient: "from-purple-600 to-pink-600",
            trend: avgProgress >= 50 ? "Great work!" : "Keep learning"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const StatCard = ({ title, value, icon: Icon, description, gradient, trend }) => (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
            <p className="text-4xl font-black text-white mb-1">{value}</p>
            <p className="text-slate-400 text-sm font-medium">{description}</p>
            <p className="text-xs text-indigo-400 font-bold mt-2">{trend}</p>
        </div>
    );

    return (
        <div className="flex bg-[#0a0f1d] min-h-screen font-sans selection:bg-indigo-500/30 overflow-hidden">
            <div className="hidden lg:block w-64">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
                <DashboardNavbar studentName={user.name} />

                <main className="p-8 pb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user.name}!</span> 👋
                        </h1>
                        <p className="text-slate-400 font-medium">
                            {inProgressCount > 0
                                ? `You have ${inProgressCount} course${inProgressCount > 1 ? 's' : ''} in progress. Keep learning!`
                                : 'Start your learning journey today!'
                            }
                        </p>
                    </motion.div>

                    {isLoading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
                            >
                                {stats.map((stat, index) => (
                                    <motion.div key={index} variants={itemVariants}>
                                        <StatCard {...stat} />
                                    </motion.div>
                                ))}
                            </motion.div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                                <div className="xl:col-span-2 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <BookOpen className="text-indigo-500 w-6 h-6" />
                                            My Courses
                                        </h2>
                                        <button
                                            onClick={() => navigate('/student/my-courses')}
                                            className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            View All
                                        </button>
                                    </div>

                                    {enrolledCourses.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {enrolledCourses.slice(0, 4).map((course) => (
                                                <motion.div
                                                    key={course.courseId}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 group hover:border-indigo-500/50 transition-all duration-300"
                                                >
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                                                            <BookOpen className="text-indigo-400 w-5 h-5" />
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${course.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                            {course.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors line-clamp-2">
                                                        {course.courseTitle}
                                                    </h3>
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                                            <span>Progress</span>
                                                            <span className="text-indigo-400">{course.progressPercentage || 0}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${course.progressPercentage || 0}%` }}
                                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-indigo-600 rounded-xl font-bold text-sm text-white transition-all duration-300">
                                                        <PlayCircle className="w-4 h-4" /> Continue
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                                            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                            <p className="text-slate-500 font-medium">No enrolled courses yet</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Rocket className="text-purple-500 w-6 h-6" />
                                        Available Courses
                                    </h2>

                                    {availableCourses.length > 0 ? (
                                        <div className="flex flex-col gap-4">
                                            {availableCourses
                                                .filter(course => course.status === 'Published')
                                                .sort((a, b) => {
                                                    // Prioritize matching class level
                                                    const aMatch = String(a.classLevel) === String(user.classLevel);
                                                    const bMatch = String(b.classLevel) === String(user.classLevel);
                                                    if (aMatch && !bMatch) return -1;
                                                    if (!aMatch && bMatch) return 1;
                                                    return 0;
                                                })
                                                .slice(0, 6).map((course) => (
                                                    <motion.div
                                                        key={course.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className={`bg-slate-900/50 border rounded-2xl p-5 hover:border-purple-500/40 transition-all duration-300 group ${String(course.classLevel) === String(user.classLevel)
                                                            ? 'border-indigo-500/30 bg-indigo-500/5'
                                                            : 'border-slate-800'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                                                                {course.title}
                                                            </h3>
                                                            {String(course.classLevel) === String(user.classLevel) && (
                                                                <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md uppercase tracking-tighter">Recommended</span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-500 text-sm line-clamp-2 mb-3">{course.description || 'No description'}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-slate-600 uppercase">{course.category || 'General'} • Class {course.classLevel || 'N/A'}</span>
                                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                                                                {course.status}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
                                            <p className="text-slate-500 font-medium">No courses available yet</p>
                                        </div>
                                    )}

                                    <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                            <Globe className="w-32 h-32" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">Premium Plan</h3>
                                        <p className="text-white/60 text-sm mb-6 relative z-10">Unlock 500+ premium industry-level courses today.</p>
                                        <button className="bg-white text-indigo-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-xl">
                                            Upgrade Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
