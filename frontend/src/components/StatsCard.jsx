import { motion } from 'framer-motion';

const StatsCard = ({ title, value, description, icon: Icon, trend }) => {
    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-indigo-500 hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                    <div className="flex items-center mt-2">
                        <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {trend >= 0 ? '+' : ''}{trend}%
                        </span>
                        <span className="text-xs text-slate-400 ml-2">{description}</span>
                    </div>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Icon size={24} />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
