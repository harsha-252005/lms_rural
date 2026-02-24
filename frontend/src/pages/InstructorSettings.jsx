import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    AtSign,
    Tags,
    Save,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import InstructorSidebar from '../components/InstructorSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import axios from 'axios';

const InstructorSettings = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [name, setName] = useState(user.name || '');
    const [email] = useState(user.email || ''); // Email usually not editable for primary account identification
    const [specialization, setSpecialization] = useState(user.specialization || '');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.put(`http://localhost:8080/api/instructors/${user.id}/update`, {
                name,
                email,
                specialization
            });

            // Update local storage
            const updatedUser = { ...user, name: response.data.name, specialization: response.data.specialization };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.put(`http://localhost:8080/api/instructors/${user.id}/change-password`, null, {
                params: {
                    oldPassword,
                    newPassword
                }
            });

            setStatus({ type: 'success', message: 'Password changed successfully!' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans">
            <InstructorSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen ml-64">
                <DashboardNavbar />

                <main className="p-8 pb-12 space-y-10 max-w-5xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Account Settings</h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">Manage your profile and security preferences.</p>
                    </motion.div>

                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex items-center gap-3 p-4 rounded-2xl ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}
                        >
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-semibold">{status.message}</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Profile Section */}
                        <motion.section
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-indigo-50 rounded-2xl">
                                    <User size={24} className="text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Profile Details</h2>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-800"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 opacity-60 cursor-not-allowed">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address (Locked)</label>
                                    <div className="relative">
                                        <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent rounded-2xl font-medium text-slate-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
                                    <div className="relative group">
                                        <Tags size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={specialization}
                                            onChange={(e) => setSpecialization(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-800"
                                            placeholder="e.g. Agriculture, Healthcare"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    <span>{loading ? 'Updating...' : 'Save Changes'}</span>
                                </button>
                            </form>
                        </motion.section>

                        {/* Password Section */}
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-indigo-50 rounded-2xl">
                                    <Lock size={24} className="text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Security</h2>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-800"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-800"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-800"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    <Lock size={20} />
                                    <span>{loading ? 'Changing...' : 'Update Password'}</span>
                                </button>
                            </form>
                        </motion.section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InstructorSettings;
