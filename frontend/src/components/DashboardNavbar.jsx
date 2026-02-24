import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, LogOut, Check, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.name || 'User';
    const userRole = user.role === 'INSTRUCTOR' ? 'Instructor' : 'Student';

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}`);
            setNotifications(response.data);
            const countResponse = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}/unread-count`);
            setUnreadCount(countResponse.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (user.id) {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = async () => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/user/${user.id}/read-all`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <header className="h-20 bg-slate-900 shadow-sm border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
            <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/5 w-96 font-sans">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for courses, lessons..."
                    className="bg-transparent border-none outline-none text-slate-300 placeholder:text-slate-500 w-full text-sm"
                />
            </div>

            <div className="flex items-center gap-6 font-sans">
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 rounded-xl transition-all duration-300 ${showNotifications ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-slate-900 text-[10px] font-bold flex items-center justify-center text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                                    <h3 className="font-black text-white tracking-tight">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                                        >
                                            <Check size={14} />
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-slate-900">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all cursor-pointer group ${!notif.read ? 'bg-indigo-500/5' : ''}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${notif.type === 'ENROLLMENT' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            notif.type === 'SYSTEM' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                                                        }`}>
                                                        {notif.type === 'ENROLLMENT' ? <User size={20} /> : <Bell size={20} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm leading-relaxed ${!notif.read ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                                                {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {!notif.read && (
                                                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-500">
                                                <Bell size={32} />
                                            </div>
                                            <p className="text-slate-400 font-bold">No notifications yet</p>
                                            <p className="text-slate-500 text-xs mt-1">We'll alert you when something happens.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-800/30 text-center">
                                    <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 w-full">
                                        View all activity <ExternalLink size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-[1px] bg-slate-800"></div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white leading-none mb-1">{displayName}</p>
                        <p className="text-xs text-indigo-400 font-medium leading-none">{userRole}</p>
                    </div>
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-slate-800 shadow-lg group-hover:shadow-indigo-500/20 transition-all">
                            <User className="w-6 h-6 text-white" />
                        </button>

                        <div className="absolute right-0 mt-3 w-52 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <div className="px-4 py-2 border-b border-slate-800 mb-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-all font-medium">
                                Your Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-all font-medium">
                                Settings
                            </button>
                            <div className="h-[1px] bg-slate-800 my-2"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 font-bold"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;

