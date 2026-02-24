import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Briefcase, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';

const InstructorRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register/instructor', formData);
            alert('Instructor registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
            >
                <div className="mb-8">
                    <div className="bg-purple-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                        <UserPlus className="text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Instructor <span className="text-purple-400">Signup</span></h2>
                    <p className="text-slate-400">Share your expertise with the world.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="email"
                            placeholder="Work Email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Specialization (e.g. Science, Art)"
                            required
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? 'Creating Account...' : (
                            <>
                                <span>Join Faculty</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400">
                        Already have an account? {' '}
                        <button onClick={() => navigate('/login')} className="text-purple-400 font-bold hover:underline">
                            Log in
                        </button>
                    </p>
                </div>
            </motion.div>
        </Layout>
    );
};

export default InstructorRegister;
