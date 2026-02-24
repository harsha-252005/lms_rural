import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Users, Star, BarChart3 } from 'lucide-react';

const InstructorCourseCard = ({ course }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-200 rounded-[2rem] p-8 group shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${course.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : course.status === 'Draft'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-slate-100 text-slate-600'
                    }`}>
                    {course.status}
                </div>
                <button className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl transition-all">
                    <Edit2 size={18} />
                </button>
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-6 group-hover:text-indigo-600 transition-colors leading-tight">
                {course.title}
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                    <div className="text-blue-500">
                        <Users size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter leading-none mb-1">Students</p>
                        <p className="text-sm font-black text-slate-700 leading-none">{course.students}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                    <div className="text-amber-500">
                        <Star size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter leading-none mb-1">Rating</p>
                        <p className="text-sm font-black text-slate-700 leading-none">{course.rating || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <button className="w-full mt-6 py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all flex items-center justify-center gap-2">
                <BarChart3 size={18} />
                <span>View Insights</span>
            </button>
        </motion.div>
    );
};

export default InstructorCourseCard;
