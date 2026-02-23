import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Rocket, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            const response = await api.post('/auth/register/student', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            alert(response.data);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data || 'Registration failed.');
        }
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-lg glass-card p-12 rounded-[3rem] overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-mint-breeze/20 blur-3xl -mr-16 -mt-16"></div>

                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-white/10">
                        <Rocket className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h2 className="text-4xl font-black text-white text-center">
                        Ignite Your <span className="text-indigo-400">Future</span>
                    </h2>
                    <p className="text-white/40 mt-3 font-medium">Join 5000+ rural students learning today</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group md:col-span-2">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-mint-breeze transition-colors" />
                        <input
                            type="text"
                            placeholder="What's your full name?"
                            required
                            className="input-glass w-full border-white/5"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="relative group md:col-span-2">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-mint-breeze transition-colors" />
                        <input
                            type="email"
                            placeholder="Your primary email"
                            required
                            className="input-glass w-full border-white/5"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Create Password"
                            required
                            className="input-glass w-full border-white/5"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Repeat Password"
                            required
                            className="input-glass w-full border-white/5"
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="btn-primary w-full py-5 group">
                            <span className="text-lg">Register as a Learner</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-white/30 text-sm">
                        Already registered? {' '}
                        <Link to="/login" className="text-indigo-400 font-bold hover:underline">Log in here</Link>
                    </p>
                    <div className="h-px bg-white/5 w-1/2 mx-auto"></div>
                    <p className="text-white/20 text-xs italic">
                        Teaching something? {' '}
                        <Link to="/register/instructor" className="text-purple-400 hover:text-purple-300 font-bold">Register as Instructor</Link>
                    </p>
                </div>
            </motion.div>
        </Layout>
    );
};

export default StudentRegister;
