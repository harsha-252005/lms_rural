import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const StudentCourseCard = ({ course }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row h-full"
        >
            {/* Thumbnail Placeholder */}
            <div className={`w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br ${course.thumbnailColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center relative p-6 shrink-0`}>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full group-hover:scale-110 transition-transform duration-500">
                    <PlayCircle className="text-white w-8 h-8" />
                </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.2 rounded-full uppercase tracking-wider">
                        In Progress
                    </span>
                    <span className="text-slate-400 text-sm font-medium">Last accessed {course.lastAccessed}</span>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                </h3>
                <p className="text-slate-500 font-medium mb-6">{course.instructor}</p>

                <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-700">Course Progress</span>
                        <span className="text-sm font-black text-indigo-600">{course.progress}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentCourseCard;
