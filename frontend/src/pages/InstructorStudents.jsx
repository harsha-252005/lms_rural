import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    AtSign,
    MapPin,
    BookOpen,
    TrendingUp,
    Search,
    Filter,
    MoreHorizontal,
    Mail
} from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import axios from 'axios';

const InstructorStudents = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/instructors/${user.id}/students`);
                setEnrollments(response.data);
            } catch (error) {
                console.error('Error fetching enrolled students:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user.id) {
            fetchStudents();
        }
    }, [user.id]);

    const filteredEnrollments = enrollments.filter(enrollment =>
        enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar />

                <main className="p-8 pb-12 space-y-8 max-w-7xl mx-auto w-full">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Students</h1>
                            <p className="text-slate-500 mt-2 text-lg font-medium">Manage and track the progress of students enrolled in your courses.</p>
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                                <Users size={20} className="text-indigo-600" />
                                <span className="font-bold text-slate-700">{enrollments.length} Total Students</span>
                            </div>
                        </div>
                    </header>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by student name, email or course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 focus:border-indigo-600 rounded-2xl outline-none transition-all font-medium text-slate-800 shadow-sm"
                            />
                        </div>
                        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                            <Filter size={20} />
                            <span>Filter</span>
                        </button>
                    </div>

                    {/* Students Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                                        <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Village</th>
                                        <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Enrolled Course</th>
                                        <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Progress</th>
                                        <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-slate-500 font-bold">Loading your students...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredEnrollments.length > 0 ? (
                                        filteredEnrollments.map((enrollment) => (
                                            <tr key={enrollment.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-black text-lg">
                                                            {enrollment.student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800">{enrollment.student.name}</p>
                                                            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                                                <AtSign size={14} />
                                                                <span>{enrollment.student.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                        <MapPin size={18} className="text-slate-400" />
                                                        <span>{enrollment.student.village}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                                                        <BookOpen size={18} className="text-indigo-600" />
                                                        <span>{enrollment.course.title}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                                                        Joined {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="w-full max-w-[120px] space-y-2">
                                                        <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-tighter transition-colors group-hover:text-indigo-600">
                                                            <span>Progress</span>
                                                            <span>{enrollment.progressPercentage}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${enrollment.progressPercentage}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                className={`h-full rounded-full ${enrollment.progressPercentage > 75 ? 'bg-emerald-500' :
                                                                        enrollment.progressPercentage > 30 ? 'bg-indigo-600' : 'bg-amber-500'
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${enrollment.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                                            enrollment.status === 'DROPPED' ? 'bg-red-50 text-red-600' :
                                                                'bg-indigo-50 text-indigo-600'
                                                        }`}>
                                                        {enrollment.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                        <button title="Email Student" className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-all">
                                                            <Mail size={18} />
                                                        </button>
                                                        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-all">
                                                            <MoreHorizontal size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                        <Users size={48} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-800 mb-2">No students found</h3>
                                                        <p className="text-slate-500 font-medium">
                                                            {searchTerm ? `We couldn't find any students matching "${searchTerm}"` : "You don't have any students enrolled in your courses yet."}
                                                        </p>
                                                    </div>
                                                    {searchTerm && (
                                                        <button
                                                            onClick={() => setSearchTerm('')}
                                                            className="text-indigo-600 font-bold hover:text-indigo-700 underline underline-offset-4"
                                                        >
                                                            Clear search query
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default InstructorStudents;
