import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowRight } from 'lucide-react';

const AvailableCourseCard = ({ course }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 group hover:border-indigo-500/30 transition-all duration-300"
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                        <course.icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-amber-400">{course.rating}</span>
                    </div>
                </div>

                <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-indigo-300 transition-colors">
                    {course.title}
                </h4>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">{course.duration}</span>
                    </div>
                    <button
                        onClick={() => console.log(`Enrolling in: ${course.title}`)}
                        className="text-xs font-bold text-indigo-400 group-hover:text-white flex items-center gap-1 transition-colors"
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
