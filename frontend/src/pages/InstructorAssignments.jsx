import { useState, useEffect } from 'react';
import { Plus, FileText, Eye } from 'lucide-react';
import api from '../utils/api';

const InstructorAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classLevel: '',
        dueDate: ''
    });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const res = await api.get(`/instructor/assignments?instructorId=${user.id}`);
            setAssignments(res.data);
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/instructor/assignments', {
                ...formData,
                instructorId: user.id
            });
            alert('Assignment created successfully!');
            setShowForm(false);
            setFormData({ title: '', description: '', classLevel: '', dueDate: '' });
            loadAssignments();
        } catch (error) {
            alert('Error creating assignment');
        }
    };

    const viewSubmissions = async (assignmentId) => {
        try {
            const res = await api.get(`/instructor/assignments/${assignmentId}/submissions`);
            alert(`Total submissions: ${res.data.length}`);
        } catch (error) {
            alert('Error loading submissions');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Assignments</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Assignment
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
                    <input
                        type="text"
                        placeholder="Assignment Title"
                        className="w-full border rounded p-3 mb-3"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="w-full border rounded p-3 mb-3"
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Class Level (e.g., 10)"
                        className="w-full border rounded p-3 mb-3"
                        value={formData.classLevel}
                        onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
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
                        Create Assignment
                    </button>
                </form>
            )}

            <div className="grid gap-4">
                {assignments.map(assignment => (
                    <div key={assignment.id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    {assignment.title}
                                </h3>
                                <p className="text-gray-600 mt-2">{assignment.description}</p>
                                <p className="text-sm text-gray-500 mt-2">Class: {assignment.classLevel}</p>
                            </div>
                            <button
                                onClick={() => viewSubmissions(assignment.id)}
                                className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-700"
                            >
                                <Eye className="w-4 h-4" />
                                View Submissions
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstructorAssignments;
