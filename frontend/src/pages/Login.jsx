import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, UserCircle, LogIn, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'STUDENT',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', formData);
            alert(response.data);
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card p-10 rounded-[2.5rem] relative"
            >
                <div className="absolute -top-6 -right-6 bg-sunset-pink w-12 h-12 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                        Hello <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Again!</span>
                    </h2>
                    <p className="text-white/40 font-medium">Ready to continue your learning journey?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-electric-indigo transition-colors" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="input-glass w-full"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-electric-indigo transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="input-glass w-full"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-electric-indigo transition-colors" />
                        <select
                            className="input-glass w-full appearance-none"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            value={formData.role}
                        >
                            <option value="STUDENT" className="bg-[#0f172a]">I am a Student</option>
                            <option value="INSTRUCTOR" className="bg-[#0f172a]">I am an Instructor</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary w-full group">
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Sign In to Dashboard
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/30 text-sm">
                        New here? {' '}
                        <Link to="/register/student" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Create Account</Link>
                    </p>
                </div>
            </motion.div>
        </Layout>
    );
};

export default Login;
