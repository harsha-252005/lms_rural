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
import StudentSidebar from '../components/StudentSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import StatCard from '../components/StatCard';
import StudentCourseCard from '../components/StudentCourseCard';
import AvailableCourseCard from '../components/AvailableCourseCard';

const Smartphone = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
);

const Cloud = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19x0a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
);

const StudentDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || 'Student';

    const [enrolledCourses, setEnrolledCourses] = useState([
        { id: 1, title: 'Introduction to Modern Agriculture', instructor: 'Dr. Ramesh Singh', progress: 65, lastAccessed: '2 hours ago', thumbnailColor: 'from-emerald-500 to-teal-600' },
        { id: 2, title: 'Basic Digital Literacy', instructor: 'Priya Sharma', progress: 30, lastAccessed: '1 day ago', thumbnailColor: 'from-blue-500 to-indigo-600' }
    ]);

    const availableCourses = [
        { id: 3, title: 'Sustainable Water Management', duration: '8 weeks', rating: 4.8, students: 1200, category: 'Environment', icon: <Globe size={24} />, color: 'text-cyan-400' },
        { id: 4, title: 'Financial Literacy for Small Business', duration: '6 weeks', rating: 4.9, students: 850, category: 'Finance', icon: <TrendingUp size={24} />, color: 'text-emerald-400' },
        { id: 5, title: 'Basic Veterinary Care', duration: '10 weeks', rating: 4.7, students: 2100, category: 'Animal Husbandry', icon: <CheckCircle size={24} />, color: 'text-amber-400' }
    ];

    const stats = [
        { title: 'Courses Completed', value: '4', icon: <CheckCircle className="text-emerald-400" />, trend: '+1 this month' },
        { title: 'Hours Learned', value: '24', icon: <Clock className="text-blue-400" />, trend: 'Top 10% this week' },
        { title: 'Skills Mastered', value: '12', icon: <Rocket className="text-purple-400" />, trend: '+3 new badges' }
    ];

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <StudentSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar />

                <main className="p-8 pb-12 space-y-10 max-w-7xl mx-auto w-full">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                                Hello, <span className="text-indigo-600">{userName}!</span> 👋
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg font-medium">Ready to continue your learning journey?</p>
                        </motion.div>

                        <div className="flex gap-3">
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                                <BookOpen size={20} />
                                <span>Resume Learning</span>
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <StatCard key={idx} {...stat} />
                        ))}
                    </div>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">Your Enrolled Courses</h2>
                            <button className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                View History
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {enrolledCourses.map(course => (
                                <StudentCourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">Explore Recommended Courses</h2>
                            <button className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {availableCourses.map(course => (
                                <AvailableCourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
