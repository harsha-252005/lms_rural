import { motion } from 'framer-motion';
import { Users, BookOpen, Settings, ListPlus, Eye } from 'lucide-react';

const CourseCard = ({ course }) => {
    const { title, description, students, lessons, status, image } = course;

    const statusStyles = {
        Published: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        Draft: 'bg-amber-50 text-amber-600 border-amber-100',
        Archived: 'bg-slate-50 text-slate-600 border-slate-100'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
        >
            <div className="h-40 bg-slate-100 relative">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-brand opacity-80 flex items-center justify-center text-white">
                        <BookOpen size={48} />
                    </div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
                    {status}
                </div>
            </div>

            <div className="p-5">
                <h4 className="text-lg font-bold text-slate-800 mb-2 truncate">{title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{description}</p>

                <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Users size={16} />
                        <span className="text-xs font-medium">{students} Students</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <BookOpen size={16} />
                        <span className="text-xs font-medium">{lessons} Lessons</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => console.log('Manage Course:', title)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                        <Settings size={18} />
                        <span className="text-[10px] mt-1 font-semibold uppercase">Manage</span>
                    </button>
                    <button
                        onClick={() => console.log('Add Lesson to:', title)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                    >
                        <ListPlus size={18} />
                        <span className="text-[10px] mt-1 font-semibold uppercase">Add</span>
                    </button>
                    <button
                        onClick={() => console.log('View Students for:', title)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                        <Eye size={18} />
                        <span className="text-[10px] mt-1 font-semibold uppercase">View</span>
                    </button>
                </div>
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
