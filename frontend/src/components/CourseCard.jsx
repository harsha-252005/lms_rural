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
            </div>
        </motion.div>
    );
};

export default CourseCard;
