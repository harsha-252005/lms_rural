import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Briefcase, UserPlus, Trophy, Star } from 'lucide-react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register/instructor', formData);
            alert(response.data);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data || 'Failed to join as instructor.');
        }
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-lg glass-card p-12 rounded-[3rem] border-purple-500/20 relative"
            >
                <div className="absolute top-6 left-6 text-purple-400/20">
                    <Star className="w-8 h-8 animate-pulse" />
                </div>

                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-purple-500/10 rounded-[2rem] mb-6">
                        <Trophy className="w-12 h-12 text-purple-400" />
                    </div>
                    <h2 className="text-4xl font-black text-white">
                        Share Your <span className="text-purple-400">Expertise</span>
                    </h2>
                    <p className="text-white/40 mt-3 font-medium">Empower rural talent with your knowledge</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Full Professional Name"
                            required
                            className="input-glass w-full border-purple-500/10"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="email"
                            placeholder="Work Email"
                            required
                            className="input-glass w-full border-purple-500/10"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Secure Password"
                            required
                            className="input-glass w-full border-purple-500/10"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Your Specialization (e.g. Science, Coding)"
                            className="input-glass w-full border-purple-500/10"
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/20">
                        <UserPlus className="w-6 h-6" />
                        Apply as Instructor
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-white/40 hover:text-white transition-colors text-sm font-medium">
                        Already have an instructor account? <span className="text-purple-400 font-bold">Log in</span>
                    </Link>
                </div>
            </motion.div>
        </Layout>
    );
};

export default InstructorRegister;
