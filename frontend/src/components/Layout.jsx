import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-[#0a0f1d] overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Dynamic Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[110px] animate-blob"></div>
            </div>

            {/* Mesh Gradient Overlay */}
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,#000_100%)]"></div>

            <Navbar />

            <main className="relative z-10 min-h-screen flex items-center justify-center p-6 pt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full h-full flex items-center justify-center"
                >
                    {children}
                </motion.div>
            </main>

            <footer className="relative z-10 py-8 text-center text-white/20 text-sm">
                &copy; 2026 Rural LMS • Revolutionizing Rural Education
            </footer>
        </div>
    );
};

export default Layout;
