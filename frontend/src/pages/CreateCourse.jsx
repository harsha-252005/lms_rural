import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    FileText,
    GraduationCap,
    Palette,
    FlaskConical,
    ImagePlus,
    Video,
    Upload,
    CheckCircle2,
    Loader2,
    AlertTriangle,
    X,
    ArrowLeft,
    Sparkles,
    FileVideo,
    Trash2
} from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../utils/api';

/* ───── animation variants ───── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ───── Toast ───── */
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

/* ═══════════════════════════════════════════
   CreateCourse — main component
   ═══════════════════════════════════════════ */
const CreateCourse = () => {
    const navigate = useNavigate();
    const thumbnailRef = useRef(null);
    const videoRef = useRef(null);

    /* ── form state ── */
    const [form, setForm] = useState({
        courseTitle: '',
        description: '',
        classLevel: '6',
        category: 'Arts',
        status: 'Draft',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videos, setVideos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    /* ── handlers ── */
    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleThumbnail = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onload = (ev) => setThumbnailPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
        if (thumbnailRef.current) thumbnailRef.current.value = '';
    };

    const handleVideos = (e) => {
        const newFiles = Array.from(e.target.files);
        setVideos(prev => [...prev, ...newFiles]);
    };

    const removeVideo = (index) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
    };

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    /* ── submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.courseTitle.trim()) {
            showToast('Please enter a course title', 'error');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const instructorId = user.id || 1;

            const formData = new FormData();
            formData.append('courseTitle', form.courseTitle);
            formData.append('description', form.description);
            formData.append('classLevel', form.classLevel);
            formData.append('category', form.category);
            formData.append('status', form.status);
            formData.append('instructorId', instructorId);

            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            videos.forEach((video) => {
                formData.append('videos', video);
            });

            await api.post('/courses/create-with-videos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(pct);
                },
            });

            showToast('Course created successfully! 🎉');
            setTimeout(() => navigate('/manage-courses'), 1500);
        } catch (err) {
            console.error('Create course error:', err);
            showToast(err.response?.data?.message || 'Failed to create course. Please try again.', 'error');
        } finally {
            setUploading(false);
        }
    };

    /* ═══════════════════════════
       RENDER
       ═══════════════════════════ */
    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar />

                <main className="p-8 pb-16 max-w-4xl mx-auto w-full">

                    {/* ─── Back Button + Header ─── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                        <button
                            onClick={() => navigate('/manage-courses')}
                            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-semibold mb-4 transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Courses</span>
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 p-3 rounded-2xl">
                                <Sparkles size={28} className="text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                    Create New <span className="text-indigo-600">Course</span>
                                </h1>
                                <p className="text-slate-400 mt-1 font-medium">
                                    Share your knowledge with students across rural schools
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── Form Card ─── */}
                    <motion.form
                        onSubmit={handleSubmit}
                        variants={container} initial="hidden" animate="show"
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
                    >
                        <div className="p-8 md:p-10 space-y-7">

                            {/* Course Title */}
                            <motion.div variants={fadeUp}>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <BookOpen size={14} /> Course Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text" required value={form.courseTitle} onChange={set('courseTitle')}
                                    placeholder="e.g. Introduction to Plant Biology"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:text-slate-300"
                                />
                            </motion.div>

                            {/* Description */}
                            <motion.div variants={fadeUp}>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <FileText size={14} /> Description
                                </label>
                                <textarea
                                    rows={4} value={form.description} onChange={set('description')}
                                    placeholder="Describe what students will learn in this course..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none placeholder:text-slate-300"
                                />
                            </motion.div>

                            {/* Class Level + Category */}
                            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        <GraduationCap size={14} /> Class Level
                                    </label>
                                    <select
                                        value={form.classLevel} onChange={set('classLevel')}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer"
                                    >
                                        {['6', '7', '8', '9', '10'].map(cl => (
                                            <option key={cl} value={cl}>Class {cl}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        {form.category === 'Science'
                                            ? <FlaskConical size={14} className="text-blue-500" />
                                            : <Palette size={14} className="text-pink-500" />
                                        }
                                        Subject Category
                                    </label>
                                    <select
                                        value={form.category} onChange={set('category')}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer"
                                    >
                                        <option value="Arts">Arts</option>
                                        <option value="Science">Science</option>
                                    </select>
                                </div>
                            </motion.div>

                            {/* Thumbnail Upload */}
                            <motion.div variants={fadeUp}>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <ImagePlus size={14} /> Thumbnail Image
                                </label>
                                {thumbnailPreview ? (
                                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-indigo-200 group">
                                        <img src={thumbnailPreview} alt="Preview"
                                            className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={removeThumbnail}
                                                className="bg-white text-red-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-50 transition-colors">
                                                <Trash2 size={16} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => thumbnailRef.current?.click()}
                                        className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/30 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                    >
                                        <ImagePlus size={36} className="text-slate-300 group-hover:text-indigo-400 mb-2 transition-colors" />
                                        <p className="text-slate-400 font-semibold text-sm">Click to upload thumbnail</p>
                                        <p className="text-slate-300 text-xs mt-1">JPG, PNG — recommended 400×250</p>
                                    </div>
                                )}
                                <input ref={thumbnailRef} type="file" accept="image/*"
                                    onChange={handleThumbnail} className="hidden" />
                            </motion.div>

                            {/* Video Upload */}
                            <motion.div variants={fadeUp}>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <Video size={14} /> Course Videos
                                </label>
                                <div
                                    onClick={() => videoRef.current?.click()}
                                    className="w-full py-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/30 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                >
                                    <Upload size={32} className="text-slate-300 group-hover:text-indigo-400 mb-2 transition-colors" />
                                    <p className="text-slate-400 font-semibold text-sm">Click to add videos</p>
                                    <p className="text-slate-300 text-xs mt-1">MP4, WebM — multiple files supported</p>
                                </div>
                                <input ref={videoRef} type="file" accept="video/*" multiple
                                    onChange={handleVideos} className="hidden" />

                                {/* video list */}
                                {videos.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {videos.map((v, i) => (
                                            <motion.div
                                                key={`${v.name}-${i}`}
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <FileVideo size={18} className="text-indigo-400 shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-700 truncate">{v.name}</p>
                                                        <p className="text-xs text-slate-400">{formatSize(v.size)}</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeVideo(i)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors shrink-0 ml-3">
                                                    <X size={16} />
                                                </button>
                                            </motion.div>
                                        ))}
                                        <p className="text-xs text-slate-400 font-semibold mt-1">
                                            {videos.length} video{videos.length > 1 ? 's' : ''} selected
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Status */}
                            <motion.div variants={fadeUp}>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                    Status
                                </label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${form.status === 'Draft'
                                            ? 'border-amber-400 bg-amber-50 text-amber-700'
                                            : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                                        }`}>
                                        <input type="radio" name="status" value="Draft"
                                            checked={form.status === 'Draft'} onChange={set('status')}
                                            className="hidden" />
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.status === 'Draft' ? 'border-amber-500' : 'border-slate-300'
                                            }`}>
                                            {form.status === 'Draft' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                                        </div>
                                        <span className="font-bold text-sm">📝 Draft</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${form.status === 'Published'
                                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                            : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                                        }`}>
                                        <input type="radio" name="status" value="Published"
                                            checked={form.status === 'Published'} onChange={set('status')}
                                            className="hidden" />
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.status === 'Published' ? 'border-emerald-500' : 'border-slate-300'
                                            }`}>
                                            {form.status === 'Published' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                        </div>
                                        <span className="font-bold text-sm">🌐 Published</span>
                                    </label>
                                </div>
                            </motion.div>

                            {/* Upload Progress */}
                            <AnimatePresence>
                                {uploading && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Uploading course...</span>
                                            </div>
                                            <span className="text-indigo-600 font-bold text-sm">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-300"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ─── Submit Footer ─── */}
                        <motion.div variants={fadeUp}
                            className="bg-slate-50 border-t border-slate-100 px-8 md:px-10 py-5 flex items-center justify-between"
                        >
                            <button type="button" onClick={() => navigate('/manage-courses')}
                                disabled={uploading}
                                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-white hover:border-slate-300 transition-all disabled:opacity-40"
                            >Cancel</button>
                            <button type="submit" disabled={uploading}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {uploading
                                    ? <><Loader2 size={18} className="animate-spin" /> Creating...</>
                                    : <><Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> Create Course</>
                                }
                            </button>
                        </motion.div>
                    </motion.form>
                </main>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CreateCourse;
