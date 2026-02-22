import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Star } from 'lucide-react';

const CourseCard = ({ course }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group shadow-lg"
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={course.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-500 text-white px-2 py-1 rounded-md uppercase tracking-wider">
                            {course.category || 'Development'}
                        </span>
                    </div>
                    <h4 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                        {course.title}
                    </h4>
                </div>
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 duration-300">
                    <PlayCircle className="w-10 h-10 fill-white/20" />
                </button>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-400">
                            {course.instructor.charAt(0)}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400">by <span className="text-slate-200 font-semibold">{course.instructor}</span></span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Overall Progress</span>
                        <span className="text-indigo-400 font-bold">{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        ></motion.div>
                    </div>
                </div>

                <button
                    onClick={() => console.log(`Continue learning: ${course.title}`)}
                    className="w-full mt-6 py-3 bg-slate-800 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
                >
                    Continue Learning
                </button>
            </div>
        </motion.div>
    );
};

export default CourseCard;
