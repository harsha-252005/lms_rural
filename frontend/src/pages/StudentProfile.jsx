import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Award, Edit2, Save } from 'lucide-react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        village: '',
        classLevel: ''
    });
    const [stats, setStats] = useState({ enrolled: 0, completed: 0 });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            loadProfile(storedUser.id);
        }
    }, []);

    const loadProfile = async (studentId) => {
        try {
            const [profileRes, coursesRes] = await Promise.all([
                api.get(`/students/${studentId}`),
                api.get(`/students/${studentId}/my-courses`)
            ]);
            
            setUser(profileRes.data);
            setFormData({
                name: profileRes.data.name,
                email: profileRes.data.email,
                phone: profileRes.data.phone,
                village: profileRes.data.village,
                classLevel: profileRes.data.classLevel
            });
            
            setStats({
                enrolled: coursesRes.data.length,
                completed: coursesRes.data.filter(c => c.status === 'COMPLETED').length
            });
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleSave = async () => {
        try {
            await api.put(`/students/${user.id}`, formData);
            alert('Profile updated successfully!');
            setIsEditing(false);
            loadProfile(user.id);
            localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
        } catch (error) {
            alert('Error updating profile');
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0f1d]">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex bg-[#0a0f1d] min-h-screen">
            <div className="hidden lg:block w-64">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
                <DashboardNavbar studentName={user.name} />

                <main className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-4xl font-black text-white">My Profile</h1>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <BookOpen className="w-5 h-5 text-indigo-400" />
                                    <span className="text-slate-400 text-sm">Enrolled Courses</span>
                                </div>
                                <p className="text-3xl font-black text-white">{stats.enrolled}</p>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award className="w-5 h-5 text-green-400" />
                                    <span className="text-slate-400 text-sm">Completed</span>
                                </div>
                                <p className="text-3xl font-black text-white">{stats.completed}</p>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <BookOpen className="w-5 h-5 text-amber-400" />
                                    <span className="text-slate-400 text-sm">Class Level</span>
                                </div>
                                <p className="text-3xl font-black text-white">{user.classLevel}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                    <p className="text-slate-400">Student ID: {user.id}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2">
                                        <User className="w-4 h-4" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        Village
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.village}
                                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2">
                                        <BookOpen className="w-4 h-4" />
                                        Class Level
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.classLevel}
                                        onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfile;
