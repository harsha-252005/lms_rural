import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, UserCircle, GraduationCap, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'STUDENT',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', formData);
            const userData = response.data;
            console.log('Login response:', userData);

            // Ensure role is set
            if (!userData.role) {
                userData.role = formData.role;
            }

            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Stored user:', userData);

            if (userData.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else {
                navigate('/instructor/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <div className="min-h-screen w-full flex bg-[#0f172a] font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 grid-bg z-0"></div>

            <div className="hidden lg:flex w-1/2 relative bg-[#1e293b] p-12 flex-col justify-between overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-12"
                    >
                        <div className="bg-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white font-black text-3xl tracking-tighter">
                            Rural<span className="text-indigo-400">LMS</span>
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="max-w-md"
                    >
                        <h1 className="text-6xl font-black text-white leading-tight mb-6 tracking-tight">
                            Bridging the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Knowledge Gap</span> <br />
                            for Rural Minds.
                        </h1>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed">
                            Empowering communities through accessible, world-class education. Join the revolution today.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="relative z-10 glass-card p-8 rounded-[2.5rem] max-w-sm border border-white/10"
                >
                    <div className="flex gap-4 mb-4">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                            <Zap size={20} />
                        </div>
                    </div>
                    <p className="text-slate-200 font-medium italic mb-4 text-lg leading-relaxed">
                        &quot;Bringing world-class education to every corner of rural India. Your background should not determine your future.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 font-bold flex items-center justify-center text-white text-sm shadow-lg shadow-indigo-500/20">AS</div>
                        <div>
                            <p className="text-white font-bold">Anita Sharma</p>
                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Rural Educator</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:hidden absolute top-8 left-8 flex items-center gap-2"
                >
                    <div className="bg-indigo-500 p-1.5 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter">RuralLMS</span>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
                >
                    <motion.div variants={itemVariants} className="mb-12">
                        <h2 className="text-5xl font-black text-white mb-3 tracking-tight">
                            Welcome <span className="text-indigo-500">Back</span>
                        </h2>
                        <div className="h-1.5 w-20 bg-indigo-500 rounded-full mb-4"></div>
                        <p className="text-slate-400 font-medium text-lg">Secure access to your learning portal.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors duration-300" />
                                <input
                                    type="email"
                                    placeholder="name@rural-lms.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all backdrop-blur-sm"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                                <button type="button" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors duration-300">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors duration-300" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all backdrop-blur-sm"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Account Type</label>
                            <div className="relative group">
                                <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors duration-300" />
                                <select
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all backdrop-blur-sm cursor-pointer"
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    value={formData.role}
                                >
                                    <option value="STUDENT" className="bg-slate-900">Student Account</option>
                                    <option value="INSTRUCTOR" className="bg-slate-900">Instructor Account</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                                    <ArrowRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-4">
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.01, translateY: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-black text-lg py-5 rounded-2xl shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden animate-shimmer"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Sign In to Your Dashboard</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="mt-12 text-center">
                        <p className="text-slate-500 font-bold text-lg">
                            New to RuralLMS?
                            <Link to="/register/student" className="text-white hover:text-indigo-400 transition-colors duration-300 ml-2 relative group inline-block">
                                Create Account
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;