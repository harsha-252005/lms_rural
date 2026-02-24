import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative overflow-hidden p-6 rounded-2xl border border-slate-200 shadow-sm bg-white hover:shadow-lg transition-shadow"
        >
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-slate-50">
                    {icon}
                </div>

                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-end gap-3">
                    <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
                    {trend && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mb-1">
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
