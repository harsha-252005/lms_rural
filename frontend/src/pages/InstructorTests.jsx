import { useState, useEffect } from 'react';
import { Plus, ClipboardCheck, Eye, Sparkles } from 'lucide-react';
import api from '../utils/api';

const InstructorTests = () => {
    const [tests, setTests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        topic: 'math',
        classLevel: '',
        totalMarks: 10,
        dueDate: ''
    });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            if (!user?.id) {
                console.error('DEBUG_FRONTEND: No user ID found in localStorage!');
                return;
            }
            console.log('DEBUG_FRONTEND: Loading tests for instructorId:', user.id, 'type:', typeof user.id);
            const res = await api.get(`/instructor/tests?instructorId=${user.id}`);
            console.log('DEBUG_FRONTEND: Tests received count:', res.data?.length);
            console.log('DEBUG_FRONTEND: All tests received:', JSON.stringify(res.data, null, 2));
            setTests(res.data);
        } catch (error) {
            console.error('DEBUG_FRONTEND: Error loading tests:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                instructorId: user.id
            };
            console.log('DEBUG_FRONTEND: Creating test with payload:', JSON.stringify(payload, null, 2));
            const res = await api.post('/instructor/tests', payload);
            console.log('DEBUG_FRONTEND: SECURE Test creation response status:', res.status);
            console.log('DEBUG_FRONTEND: Test creation response data:', JSON.stringify(res.data, null, 2));
            alert('Test created with auto-generated questions!');
            setShowForm(false);
            setFormData({ title: '', topic: 'math', classLevel: '', totalMarks: 10, dueDate: '' });
            loadTests();
        } catch (error) {
            console.error('DEBUG_FRONTEND: Error creating test:', error);
            if (error.response) {
                console.error('DEBUG_FRONTEND: Error response data:', error.response.data);
                console.error('DEBUG_FRONTEND: Error response status:', error.response.status);
            }
            alert('Error creating test: ' + (error.response?.data?.message || error.message));
        }
    };

    const viewSubmissions = async (testId) => {
        try {
            const res = await api.get(`/instructor/tests/${testId}/submissions`);
            if (res.data.length === 0) {
                alert('No submissions yet');
            } else {
                const results = res.data.map(s => `Student ${s.studentId}: ${s.score}/${s.totalMarks}`).join('\n');
                alert(`Test Results:\n\n${results}`);
            }
        } catch (error) {
            alert('Error loading submissions');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tests</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Test
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-white/10 mb-8 text-slate-900">
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-800">Questions will be auto-generated based on topic!</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Test Title"
                        className="w-full border rounded p-3 mb-3"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <select
                        className="w-full border rounded p-3 mb-3"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                        <option value="math">Mathematics</option>
                        <option value="science">Science</option>
                        <option value="english">English</option>
                        <option value="history">History</option>
                    </select>
                    <select
                        className="w-full border rounded p-3 mb-3"
                        value={formData.classLevel}
                        onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                        required
                    >
                        <option value="">Select Class/Level</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1)}>Class {i + 1}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Total Marks"
                        className="w-full border rounded p-3 mb-3"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                        required
                    />
                    <input
                        type="datetime-local"
                        className="w-full border rounded p-3 mb-3"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                        Create Test with Auto Questions
                    </button>
                </form>
            )}

            <div className="grid gap-6">
                {tests.map(test => (
                    <div key={test.id} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 text-slate-900">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5" />
                                    {test.title}
                                </h3>
                                <p className="text-gray-600 mt-2">Topic: {test.topic}</p>
                                <p className="text-sm text-gray-500 mt-1">Class: {test.classLevel} | Marks: {test.totalMarks}</p>
                            </div>
                            <button
                                onClick={() => viewSubmissions(test.id)}
                                className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-700"
                            >
                                <Eye className="w-4 h-4" />
                                View Results
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstructorTests;
