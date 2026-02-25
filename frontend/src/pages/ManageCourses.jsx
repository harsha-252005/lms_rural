import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    CheckCircle2,
    FileEdit,
    Users,
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    Plus,
    Star,
    Eye,
    Pencil,
    Trash2,
    Globe,
    GlobeLock,
    TrendingUp,
    BarChart3,
    DollarSign,
    ChevronRight,
    ImageIcon,
    X,
    Loader2,
    AlertTriangle,
    Rocket
} from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import StatCard from '../components/StatCard';
import api from '../utils/api';

/* ───── mock enrichment (fields backend doesn't provide yet) ───── */
const CATEGORIES = ['Agriculture', 'Technology', 'Environment', 'Finance', 'Business', 'Health'];
const THUMBNAILS = [
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
];

const enrichCourse = (c, idx) => ({
    ...c,
    category: c.category || CATEGORIES[idx % CATEGORIES.length],
    status: c.status || 'Draft',
    students: c.students ?? Math.floor(Math.random() * 500),
    rating: c.rating ?? +(3.5 + Math.random() * 1.5).toFixed(1),
    thumbnail: c.thumbnailPath
        ? (c.thumbnailPath.startsWith('http') ? c.thumbnailPath : `/${c.thumbnailPath}`)
        : (c.thumbnail || THUMBNAILS[idx % THUMBNAILS.length]),
});

/* ───── animation variants ───── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const modalOverlay = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalContent = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.92, y: 30 },
};

/* ───── Toast component ───── */
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 40, x: '-50%' }}
        className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3.5 rounded-2xl font-semibold shadow-2xl flex items-center gap-3 ${type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
            }`}
    >
        {type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity"><X size={16} /></button>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   ManageCourses — main component
   ═══════════════════════════════════════════════════════════════ */
const ManageCourses = () => {
    const navigate = useNavigate();
    /* ── core state ── */
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Newest');

    /* ── modal state ── */
    const [editModal, setEditModal] = useState({ open: false, course: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, course: null });
    const [saving, setSaving] = useState(false);

    /* ── toast state ── */
    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };



    /* ── fetch courses ── */
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return;
            }
            
            const user = JSON.parse(userStr);
            if (!user.id) {
                localStorage.clear();
                navigate('/login');
                return;
            }
            
            const res = await api.get(`/instructors/${user.id}/courses`);
            const enriched = (res.data || []).map((c, i) => enrichCourse(c, i));
            setCourses(enriched);
        } catch (err) {
            console.error('Failed to load courses:', err);
            showToast('Failed to load courses: ' + (err.response?.data?.message || err.message), 'error');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    /* ── computed stats ── */
    const totalCourses = courses.length;
    const published = courses.filter(c => c.status === 'Published').length;
    const drafts = courses.filter(c => c.status === 'Draft').length;
    const totalEnrollments = courses.reduce((s, c) => s + (c.students || 0), 0);

    const stats = [
        { title: 'Total Courses', value: totalCourses, icon: BookOpen, trend: `${published} live` },
        { title: 'Published', value: published, icon: CheckCircle2, trend: 'Active now' },
        { title: 'Drafts', value: drafts, icon: FileEdit, trend: 'Needs review' },
        { title: 'Total Enrollments', value: totalEnrollments.toLocaleString(), icon: Users, trend: '+8% this month' },
    ];

    /* ── filtered + sorted list ── */
    const visible = courses
        .filter(c => {
            if (filter !== 'All' && c.status !== filter) return false;
            if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sort === 'Title') return a.title.localeCompare(b.title);
            if (sort === 'Most Students') return (b.students || 0) - (a.students || 0);
            if (sort === 'Rating') return (b.rating || 0) - (a.rating || 0);
            if (sort === 'Oldest') return (a.id || 0) - (b.id || 0);
            return (b.id || 0) - (a.id || 0); // Newest
        });

    /* ── Edit course (PUT) ── */
    const handleEditSave = async (formData) => {
        setSaving(true);
        try {
            const res = await api.put(`/courses/${formData.id}/update`, {
                title: formData.title,
                description: formData.description,
                duration: formData.duration,
            });
            setCourses(prev =>
                prev.map(c => c.id === formData.id
                    ? { ...c, ...res.data, title: formData.title, description: formData.description, status: formData.status, category: formData.category }
                    : c
                )
            );
            setEditModal({ open: false, course: null });
            showToast('Course updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            showToast(err.response?.data?.message || 'Failed to update course', 'error');
        } finally {
            setSaving(false);
        }
    };

    /* ── Delete course (DELETE) ── */
    const handleDelete = async (id) => {
        setSaving(true);
        try {
            await api.delete(`/courses/${id}/delete`);
            setCourses(prev => prev.filter(c => c.id !== id));
            setDeleteConfirm({ open: false, course: null });
            showToast('Course deleted successfully!');
        } catch (err) {
            console.error('Delete error:', err);
            showToast(err.response?.data?.message || 'Failed to delete course', 'error');
        } finally {
            setSaving(false);
        }
    };

    /* ── Publish / Unpublish toggle (PUT) ── */
    const togglePublish = async (course) => {
        const newStatus = course.status === 'Published' ? 'Draft' : 'Published';
        try {
            await api.put(`/courses/${course.id}/update`, {
                title: course.title,
                description: course.description || '',
                duration: course.duration || '',
                status: newStatus
            });
            setCourses(prev =>
                prev.map(c => c.id === course.id ? { ...c, status: newStatus } : c)
            );
            showToast(`Course ${newStatus === 'Published' ? 'published' : 'unpublished'}!`);
        } catch (err) {
            console.error('Toggle error:', err);
            // still toggle locally for UX
            setCourses(prev =>
                prev.map(c => c.id === course.id ? { ...c, status: newStatus } : c)
            );
            showToast(`Status updated locally (API: ${err.response?.status || 'offline'})`, 'error');
        }
    };

    /* ═══════════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════════ */
    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar />

                <main className="p-8 pb-12 space-y-10 max-w-7xl mx-auto w-full">

                    {/* ─── Header ─── */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                                Manage <span className="text-indigo-600">Courses</span>
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg font-medium">
                                Create, edit and monitor your learning content
                            </p>
                        </motion.div>

                        <motion.button
                            onClick={() => navigate('/create-course')}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group"
                        >
                            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            <span>Add New Course</span>
                        </motion.button>
                    </header>

                    {/* ─── Stats ─── */}
                    <motion.div variants={container} initial="hidden" animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {stats.map((s, i) => (
                            <motion.div key={i} variants={fadeUp}><StatCard {...s} /></motion.div>
                        ))}
                    </motion.div>

                    {/* ─── Search / Filter / Sort ─── */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }} className="flex flex-col sm:flex-row gap-4"
                    >
                        <div className="relative flex-1 group">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text" placeholder="Search courses…" value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <SlidersHorizontal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select value={filter} onChange={e => setFilter(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-10 text-slate-600 font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer"
                            >
                                <option>All</option>
                                <option>Published</option>
                                <option>Draft</option>
                            </select>
                        </div>
                        <div className="relative">
                            <ArrowUpDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select value={sort} onChange={e => setSort(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-10 text-slate-600 font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer"
                            >
                                <option>Newest</option>
                                <option>Oldest</option>
                                <option>Title</option>
                                <option>Most Students</option>
                                <option>Rating</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* ─── Loading Spinner ─── */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-400 font-semibold text-lg">Loading your courses…</p>
                        </div>
                    )}

                    {/* ─── Empty State ─── */}
                    {!loading && courses.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm"
                        >
                            <div className="bg-indigo-50 p-6 rounded-3xl mb-6">
                                <Rocket size={56} className="text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mb-2">You haven't created any courses yet</h2>
                            <p className="text-slate-400 mb-8 max-w-md text-center">
                                Start sharing your knowledge with rural communities. Create your first course and make an impact!
                            </p>
                            <button onClick={() => navigate('/create-course')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group">
                                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                                <span>Create Your First Course</span>
                            </button>
                        </motion.div>
                    )}

                    {/* ─── Courses Grid ─── */}
                    {!loading && courses.length > 0 && (
                        <motion.div variants={container} initial="hidden" animate="show"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            <AnimatePresence>
                                {visible.map(course => (
                                    <motion.div
                                        key={course.id} variants={fadeUp} layout
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                        className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group"
                                    >
                                        {/* thumbnail */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={course.thumbnail} alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                            <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-100 absolute inset-0">
                                                <ImageIcon size={48} className="text-slate-300" />
                                            </div>
                                            <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${course.status === 'Published' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                                                }`}>{course.status}</span>
                                            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/80 backdrop-blur-md text-slate-600">
                                                {course.category}
                                            </span>
                                        </div>

                                        {/* body */}
                                        <div className="p-7 flex flex-col flex-1">
                                            <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                                                {course.title}
                                            </h3>
                                            {course.description && (
                                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                                            )}

                                            {/* mini stats */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="bg-slate-50 p-3.5 rounded-2xl flex items-center gap-3">
                                                    <Users size={18} className="text-blue-500" />
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Students</p>
                                                        <p className="text-sm font-black text-slate-700 leading-none">{(course.students || 0).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 p-3.5 rounded-2xl flex items-center gap-3">
                                                    <Star size={18} className="text-amber-500" />
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Rating</p>
                                                        <p className="text-sm font-black text-slate-700 leading-none">{course.rating || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* action buttons */}
                                            <div className="mt-auto grid grid-cols-4 gap-2">
                                                <button onClick={() => navigate(`/view-course/${course.id}`)} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all" title="View">
                                                    <Eye size={18} /><span className="text-[10px] font-bold uppercase">View</span>
                                                </button>
                                                <button onClick={() => setEditModal({ open: true, course: { ...course } })}
                                                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all" title="Edit">
                                                    <Pencil size={18} /><span className="text-[10px] font-bold uppercase">Edit</span>
                                                </button>
                                                <button onClick={() => togglePublish(course)}
                                                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${course.status === 'Published'
                                                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                        }`} title={course.status === 'Published' ? 'Unpublish' : 'Publish'}>
                                                    {course.status === 'Published' ? <GlobeLock size={18} /> : <Globe size={18} />}
                                                    <span className="text-[10px] font-bold uppercase">
                                                        {course.status === 'Published' ? 'Unpublish' : 'Publish'}
                                                    </span>
                                                </button>
                                                <button onClick={() => setDeleteConfirm({ open: true, course })}
                                                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Delete">
                                                    <Trash2 size={18} /><span className="text-[10px] font-bold uppercase">Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* no results for current filter/search */}
                            {visible.length === 0 && (
                                <div className="col-span-full text-center py-20">
                                    <Search size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-400 text-lg font-semibold">No courses match your search</p>
                                    <p className="text-slate-400 text-sm mt-1">Try changing your search term or filter.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ─── Analytics Section ─── */}
                    {!loading && courses.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-50/50 rounded-full blur-3xl -mr-36 -mt-36" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">Course Analytics</h2>
                                        <p className="text-slate-400 mt-1">Performance overview for all your courses</p>
                                    </div>
                                    <button className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                        <span>Detailed Report</span><ChevronRight size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><TrendingUp size={20} className="text-blue-500" /></div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Enrollment Growth</p>
                                                <p className="text-2xl font-black text-slate-800">+23%</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '73%' }} transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" />
                                        </div>
                                        <p className="text-xs text-slate-400">73% of target achieved</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><BarChart3 size={20} className="text-emerald-500" /></div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completion Rate</p>
                                                <p className="text-2xl font-black text-slate-800">68%</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" />
                                        </div>
                                        <p className="text-xs text-slate-400">Above average for this category</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><DollarSign size={20} className="text-purple-500" /></div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Revenue</p>
                                                <p className="text-2xl font-black text-slate-800">₹42,500</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '58%' }} transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" />
                                        </div>
                                        <p className="text-xs text-slate-400">₹5.2k earned this month</p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                </main>
            </div>

            {/* ═══════════════════════════════════════════════
               EDIT MODAL
               ═══════════════════════════════════════════════ */}
            <AnimatePresence>
                {editModal.open && (
                    <motion.div variants={modalOverlay} initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => !saving && setEditModal({ open: false, course: null })}
                    >
                        <motion.div variants={modalContent} initial="hidden" animate="visible" exit="exit"
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            {/* modal header */}
                            <div className="flex items-center justify-between px-8 pt-8 pb-2">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800">Edit Course</h2>
                                    <p className="text-slate-400 text-sm mt-1">Update your course details</p>
                                </div>
                                <button onClick={() => !saving && setEditModal({ open: false, course: null })}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* modal body */}
                            <EditForm
                                course={editModal.course}
                                saving={saving}
                                onSave={handleEditSave}
                                onCancel={() => setEditModal({ open: false, course: null })}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════
               DELETE CONFIRMATION MODAL
               ═══════════════════════════════════════════════ */}
            <AnimatePresence>
                {deleteConfirm.open && (
                    <motion.div variants={modalOverlay} initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => !saving && setDeleteConfirm({ open: false, course: null })}
                    >
                        <motion.div variants={modalContent} initial="hidden" animate="visible" exit="exit"
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 text-center"
                        >
                            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Delete Course?</h2>
                            <p className="text-slate-400 mb-8">
                                Are you sure you want to delete <strong className="text-slate-700">"{deleteConfirm.course?.title}"</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirm({ open: false, course: null })}
                                    disabled={saving}
                                    className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                                >Cancel</button>
                                <button onClick={() => handleDelete(deleteConfirm.course?.id)}
                                    disabled={saving}
                                    className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    <span>{saving ? 'Deleting...' : 'Delete'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Toast ─── */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   EditForm — sub-component for the edit modal
   ═══════════════════════════════════════════════ */
const EditForm = ({ course, saving, onSave, onCancel }) => {
    const [form, setForm] = useState({
        id: course?.id,
        title: course?.title || '',
        description: course?.description || '',
        category: course?.category || '',
        status: course?.status || 'Draft',
        duration: course?.duration || '',
    });

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-5">
            {/* Title */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Course Title</label>
                <input type="text" required value={form.title} onChange={set('title')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" />
            </div>

            {/* Description */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea rows={3} value={form.description} onChange={set('description')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none" />
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                    <select value={form.category} onChange={set('category')}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                    <select value={form.status} onChange={set('status')}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer"
                    >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                </div>
            </div>

            {/* Duration */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Duration</label>
                <input type="text" placeholder="e.g. 4 weeks" value={form.duration} onChange={set('duration')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
                <button type="button" onClick={onCancel} disabled={saving}
                    className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                >Cancel</button>
                <button type="submit" disabled={saving}
                    className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    );
};

export default ManageCourses;
