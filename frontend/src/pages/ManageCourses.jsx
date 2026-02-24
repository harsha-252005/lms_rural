import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import InstructorCourseCard from '../components/InstructorCourseCard';
import DashboardNavbar from '../components/DashboardNavbar';

const ManageCourses = () => {
    const courses = [
        { id: 1, title: 'Introduction to Modern Agriculture', students: 450, status: 'Published', rating: 4.8 },
        { id: 2, title: 'Basic Digital Literacy', students: 120, status: 'Draft', rating: 0 },
        { id: 3, title: 'Sustainable Water Management', students: 85, status: 'Published', rating: 4.5 },
        { id: 4, title: 'Financial Literacy', students: 210, status: 'Archived', rating: 4.2 },
    ];

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
                <DashboardNavbar />

                <main className="p-8 pb-12 space-y-8 max-w-7xl mx-auto w-full">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>
                            <p className="text-slate-500 mt-1 text-lg">Manage and track your educational content.</p>
                        </div>
                        <button
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
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
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
                            <InstructorCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageCourses;
