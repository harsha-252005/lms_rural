import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle,
    Clock,
    TrendingUp,
    Globe,
    Database,
    Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import StatCard from '../components/StatCard';
import CourseCard from '../components/CourseCard';
import AvailableCourseCard from '../components/AvailableCourseCard';

// Helper for Smartphone/Cloud icons as they weren't in main lucide list above
const Smartphone = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
);

const Cloud = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c3.037 0 5.5-2.463 5.5-5.5 0-2.799-2.095-5.111-4.839-5.462A7.514 7.514 0 0 0 10.5 3c-3.52 0-6.442 2.416-7.237 5.679A5.004 5.004 0 0 0 3.5 18h14Z" /></svg>
);

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "Student" });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, []);

    // Mock Data
    const stats = [
        {
            title: "Enrolled Courses",
            value: "12",
            icon: BookOpen,
            description: "Total courses joined",
            gradient: "from-blue-600 to-indigo-600",
            trend: "+2 this month"
        },
        {
            title: "Completed",
            value: "08",
            icon: CheckCircle,
            description: "Finished certifications",
            gradient: "from-emerald-600 to-teal-600",
            trend: "85% avg score"
        },
        {
            title: "In Progress",
            value: "04",
            icon: Clock,
            description: "Currently learning",
            gradient: "from-amber-600 to-orange-600",
            trend: "Avg 2h/day"
        },
        {
            title: "Skill Level",
            value: "78%",
            icon: TrendingUp,
            description: "Overall progress",
            gradient: "from-purple-600 to-pink-600",
            trend: "Top 5% student"
        }
    ];

    const myCourses = [
        {
            id: 1,
            title: "Advanced React Patterns",
            instructor: "Dr. Sarah Chen",
            progress: 75,
            category: "Development",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
        },
        {
            id: 2,
            title: "UI/UX Mastery 2026",
            instructor: "Alex Rivera",
            progress: 45,
            category: "Design",
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop&q=60"
        },
        {
            id: 3,
            title: "Fullstack Web3 Basics",
            instructor: "Michael Kels",
            progress: 20,
            category: "Blockchain",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60"
        }
    ];

    const availableCourses = [
        {
            id: 4,
            title: "Data Science with Python",
            description: "Master data analysis, visualization and machine learning using real-world datasets.",
            duration: "12 Weeks",
            rating: 4.9,
            icon: Database
        },
        {
            id: 5,
            title: "Mobile App Dev (Flutter)",
            description: "Build beautiful, natively compiled applications for mobile from a single codebase.",
            duration: "8 Weeks",
            rating: 4.8,
            icon: Smartphone
        },
        {
            id: 6,
            title: "Cloud Architecture (AWS)",
            description: "Design and deploy scalable, highly available systems on Amazon Web Services.",
            duration: "10 Weeks",
            rating: 4.7,
            icon: Cloud
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

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
                        <p className="text-slate-400 font-medium">Continue your learning journey today. You have 3 lessons due.</p>
                    </motion.div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Rocket className="text-purple-500 w-6 h-6" />
                                    Explore New
                                </h2>
                            </div>

                            <div className="flex flex-col gap-6">
                                {availableCourses.map((course) => (
                                    <AvailableCourseCard key={course.id} course={course} />
                                ))}
                            </div>

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
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
