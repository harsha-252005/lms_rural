import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowRight } from 'lucide-react';

const AvailableCourseCard = ({ course }) => {
    const Icon = course.icon;
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 group hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform ${course.color || 'text-indigo-500'}`}>
                        {Icon && <Icon size={24} />}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-amber-600">{course.rating}</span>
                    </div>
                </div>

                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full w-fit mb-2 uppercase tracking-wider">
                    {course.category}
                </span>

                <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                </h4>

                <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <span className="text-sm">{course.students?.toLocaleString()} students</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">{course.duration}</span>
                    </div>
                    <button
                        onClick={() => console.log(`Enrolling in: ${course.title}`)}
                        className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1 transition-colors"
                    >
                        Enroll Now
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AvailableCourseCard;
