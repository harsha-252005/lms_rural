import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import CourseCard from '../components/CourseCard';

const ManageCourses = () => {
    const courses = [
        {
            id: 1,
            title: 'React Masterclass: From Zero to Hero',
            description: 'Master React.js with hooks, context API, and advanced patterns. Build real-world applications.',
            students: 542,
            lessons: 45,
            status: 'Published',
        },
        {
            id: 2,
            title: 'Advanced Java Design Patterns',
            description: 'Deep dive into structural, behavioral, and creational patterns in Java. Enterprise-grade code.',
            students: 215,
            lessons: 32,
            status: 'Published',
        },
        {
            id: 3,
            title: 'UI/UX Design for SaaS Products',
            description: 'Learn to design beautiful and functional interfaces for the modern web using Figma.',
            students: 128,
            lessons: 24,
            status: 'Draft',
        },
        {
            id: 4,
            title: 'Tailwind CSS: Modern Styling',
            description: 'Rapidly build modern websites without ever leaving your HTML. Comprehensive guide.',
            students: 402,
            lessons: 18,
            status: 'Published',
        },
        {
            id: 5,
            title: 'Node.js Backend Architecture',
            description: 'Scale your applications with efficient Node.js patterns and microservices.',
            students: 0,
            lessons: 12,
            status: 'Archived',
        },
        {
            id: 6,
            title: 'Fullstack Next.js 14 App',
            description: 'The complete guide to building blazing fast apps with the App Router and Server Actions.',
            students: 89,
            lessons: 56,
            status: 'Draft',
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>
                    <p className="text-slate-500 mt-1">Manage, edit, and track the performance of your educational content.</p>
                </div>
                <button
                    onClick={() => console.log('Create New Course clicked')}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
                >
                    <Plus size={20} />
                    <span>New Course</span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your courses..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-600"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-all">
                    <Filter size={20} />
                    <span>Filters</span>
                </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default ManageCourses;
