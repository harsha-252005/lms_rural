import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Palette,
    FlaskConical,
    Globe,
    FileEdit,
    Play,
    FileVideo,
    Calendar,
    User,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    X
} from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../utils/api';

/* ───── animation ───── */
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };

const ViewCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
                // auto-select first video
                if (res.data.videos && res.data.videos.length > 0) {
                    setActiveVideo(res.data.videos[0]);
                }
            } catch (err) {
                console.error('Fetch course error:', err);
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    /* ═══════════════════════════
       RENDER
       ═══════════════════════════ */

    if (loading) {
        return (
            <div className="flex bg-[#f8fafc] min-h-screen font-sans">
                <InstructorSidebar />
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                    <DashboardNavbar />
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-400 font-semibold text-lg">Loading course…</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex bg-[#f8fafc] min-h-screen font-sans">
                <InstructorSidebar />
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                    <DashboardNavbar />
                    <div className="flex flex-col items-center justify-center py-32">
                        <AlertTriangle size={48} className="text-red-400 mb-4" />
                        <p className="text-slate-600 font-bold text-xl mb-2">Course Not Found</p>
                        <p className="text-slate-400 mb-6">{error || 'This course does not exist.'}</p>
                        <button onClick={() => navigate('/manage-courses')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                            Back to Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const hasVideos = course.videos && course.videos.length > 0;

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar />

                <main className="p-8 pb-16 max-w-6xl mx-auto w-full">

                    {/* ─── Back Button ─── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                        <button
                            onClick={() => navigate('/manage-courses')}
                            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-semibold transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Courses</span>
                        </button>
                    </motion.div>

                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

                        {/* ─── Course Header ─── */}
                        <motion.div variants={fadeUp}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
                        >
                            {/* thumbnail banner */}
                            <div className="relative h-56 bg-gradient-to-br from-indigo-100 to-slate-100 overflow-hidden">
                                {course.thumbnailPath ? (
                                    <img src={course.thumbnailPath} alt={course.title}
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen size={64} className="text-slate-300" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-6 left-8 right-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${course.status === 'Published'
                                                ? 'bg-emerald-500/90 text-white'
                                                : 'bg-amber-500/90 text-white'
                                            }`}>
                                            {course.status === 'Published' ? <Globe size={12} className="inline mr-1.5 -mt-0.5" /> : <FileEdit size={12} className="inline mr-1.5 -mt-0.5" />}
                                            {course.status || 'Draft'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 backdrop-blur-md text-slate-600">
                                            {course.category === 'Science'
                                                ? <FlaskConical size={12} className="inline mr-1 -mt-0.5 text-blue-500" />
                                                : <Palette size={12} className="inline mr-1 -mt-0.5 text-pink-500" />
                                            }
                                            {course.category || 'General'}
                                        </span>
                                        {course.classLevel && (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 backdrop-blur-md text-slate-600">
                                                <GraduationCap size={12} className="inline mr-1 -mt-0.5 text-indigo-500" />
                                                Class {course.classLevel}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
                                        {course.title}
                                    </h1>
                                </div>
                            </div>

                            {/* info row */}
                            <div className="p-8">
                                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-6">
                                    {course.instructor && (
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-indigo-500" />
                                            <span className="font-semibold">{course.instructor.name}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-indigo-500" />
                                        <span className="font-semibold">Created {formatDate(course.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileVideo size={16} className="text-indigo-500" />
                                        <span className="font-semibold">{course.videos?.length || 0} video{(course.videos?.length || 0) !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                {course.description && (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                                        <p className="text-slate-600 leading-relaxed">{course.description}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* ─── Video Player Section ─── */}
                        <motion.div variants={fadeUp}>
                            {hasVideos ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Player */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video">
                                            <video
                                                key={activeVideo?.videoPath}
                                                controls
                                                autoPlay
                                                className="w-full h-full"
                                            >
                                                <source src={activeVideo?.videoPath} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <Play size={18} className="text-indigo-600" />
                                                Now Playing: {activeVideo?.fileName}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Video List */}
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="p-4 border-b border-slate-100">
                                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                                <FileVideo size={18} className="text-indigo-500" />
                                                Course Videos ({course.videos.length})
                                            </h3>
                                        </div>
                                        <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                                            {course.videos.map((video, idx) => (
                                                <button
                                                    key={video.id}
                                                    onClick={() => setActiveVideo(video)}
                                                    className={`w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-indigo-50 ${activeVideo?.id === video.id
                                                            ? 'bg-indigo-50 border-l-4 border-indigo-500'
                                                            : 'border-l-4 border-transparent'
                                                        }`}
                                                >
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activeVideo?.id === video.id
                                                            ? 'bg-indigo-500 text-white'
                                                            : 'bg-slate-100 text-slate-400'
                                                        }`}>
                                                        {activeVideo?.id === video.id
                                                            ? <Play size={16} className="ml-0.5" />
                                                            : <span className="text-xs font-bold">{idx + 1}</span>
                                                        }
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-semibold truncate ${activeVideo?.id === video.id ? 'text-indigo-700' : 'text-slate-700'
                                                            }`}>
                                                            {video.fileName}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center">
                                    <div className="bg-slate-50 p-5 rounded-2xl mb-4">
                                        <FileVideo size={48} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Videos Yet</h3>
                                    <p className="text-slate-400 text-center max-w-sm">
                                        This course doesn't have any videos uploaded. Edit the course to add video content.
                                    </p>
                                </div>
                            )}
                        </motion.div>

                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default ViewCourse;
