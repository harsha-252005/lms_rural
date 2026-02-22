import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, description, gradient, trend }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden p-6 rounded-2xl border border-white/10 shadow-xl bg-gradient-to-br ${gradient}`}
        >
            <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                <Icon className="w-24 h-24" />
            </div>

            <div className="relative z-10">
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                    <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-end gap-3">
                    <p className="text-3xl font-black text-white tracking-tight">{value}</p>
                    {trend && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg mb-1">
                            {trend}
                        </span>
                    )}
                </div>
                <p className="text-white/40 text-xs mt-2 uppercase tracking-wider font-bold">{description}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
