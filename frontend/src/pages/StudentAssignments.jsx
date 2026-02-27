import { useState, useEffect } from 'react';
import { FileText, Calendar, Send } from 'lucide-react';
import api from '../utils/api';

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const res = await api.get(`/student/${user.id}/assignments`);
            setAssignments(res.data);
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    };

    const handleSubmit = async (assignmentId) => {
        try {
            await api.post('/student/assignments/submit', {
                assignmentId,
                studentId: user.id,
                content: submissions[assignmentId] || ''
            });
            alert('Assignment submitted successfully!');
            setSubmissions({ ...submissions, [assignmentId]: '' });
        } catch (error) {
            alert('Error submitting assignment');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Assignments</h1>
            <div className="grid gap-4">
                {assignments.map(assignment => (
                    <div key={assignment.id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    {assignment.title}
                                </h3>
                                <p className="text-gray-600 mt-2">{assignment.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                        </div>
                        <textarea
                            className="w-full border rounded p-3 mb-3"
                            rows="4"
                            placeholder="Write your answer here..."
                            value={submissions[assignment.id] || ''}
                            onChange={(e) => setSubmissions({ ...submissions, [assignment.id]: e.target.value })}
                        />
                        <button
                            onClick={() => handleSubmit(assignment.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Send className="w-4 h-4" />
                            Submit Assignment
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentAssignments;
