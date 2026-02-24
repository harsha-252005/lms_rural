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
            localStorage.setItem('user', JSON.stringify(response.data));

            if (response.data.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else if (response.data.role === 'INSTRUCTOR') {
                navigate('/instructor/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : 'Login failed. Please check your credentials.');
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#0f172a] font-sans selection:bg-indigo-500/30 overflow-hidden">
            <div className="hidden lg:flex w-1/2 relative bg-[#1e293b] p-12 flex-col justify-between overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white font-black text-3xl tracking-tighter">
                            Rural<span className="text-indigo-400">LMS</span>
                        </span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-md"
                    >
                        <h1 className="text-5xl font-black text-white leading-tight mb-6">
                            Master your <span className="text-indigo-400">future</span>, anywhere in the world.
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            Join over 50,000+ students learning the most in-demand skills from top industry experts.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] max-w-sm"
                >
                    <div className="flex gap-4 mb-4">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                            <Zap size={20} />
                        </div>
                    </div>
                    <p className="text-slate-300 font-medium italic mb-4">
                        "The best platform for accessible education. It changed my career path completely."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 font-bold flex items-center justify-center text-white text-xs">SJ</div>
                        <div>
                            <p className="text-white font-bold text-sm">Sarah Jenkins</p>
                            <p className="text-slate-500 text-xs">Fullstack Developer</p>
                        </div>
                    </div>
                </motion.div>
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px]"></div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-indigo-500" />
                    <span className="text-white font-black text-xl tracking-tighter">RuralLMS</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-white mb-3">Welcome <span className="text-indigo-500">Back</span></h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Login As</label>
                            <div className="relative group">
                                <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                                <select
                                    className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl py-4 pl-14 pr-6 text-white appearance-none focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    value={formData.role}
                                >
                                    <option value="STUDENT" className="bg-slate-900">I am a Student</option>
                                    <option value="INSTRUCTOR" className="bg-slate-900">I am an Instructor</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 group mt-4 relative overflow-hidden"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium">
                            Don't have an account? {' '}
                            <Link to="/register/student" className="text-white hover:text-indigo-400 font-bold underline underline-offset-4 decoration-indigo-500 transition-colors ml-1">
                                Create for free
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;