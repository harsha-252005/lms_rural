import { useState, useEffect } from 'react';
import { ClipboardCheck, Clock, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const StudentTests = () => {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            const res = await api.get(`/student/${user.id}/tests`);
            console.log('DEBUG_STUDENT: Tests fetched:', res.data);
            setTests(res.data);
        } catch (error) {
            console.error('Error loading tests:', error);
        }
    };

    const startTest = (test) => {
        setSelectedTest(test);
        setAnswers({});
    };

    const submitTest = async () => {
        try {
            const questions = JSON.parse(selectedTest.questions);
            const answerArray = questions.map((_, idx) => ({
                questionId: idx,
                answer: answers[idx] || ''
            }));

            const res = await api.post('/student/tests/submit', {
                testId: selectedTest.id,
                studentId: user.id,
                answers: JSON.stringify(answerArray)
            });

            alert(`Test submitted! Score: ${res.data.score}/${res.data.totalMarks}`);
            setSelectedTest(null);
            loadTests();
        } catch (error) {
            alert('Error submitting test');
        }
    };

    if (selectedTest) {
        let questions = [];
        try {
            console.log('DEBUG_STUDENT: Raw questions from DB:', selectedTest.questions);
            questions = selectedTest.questions ? JSON.parse(selectedTest.questions) : [];
            console.log('DEBUG_STUDENT: Parsed questions count:', questions.length);
            if (questions.length > 0) {
                console.log('DEBUG_STUDENT: First question sample:', questions[0]);
            }
        } catch (e) {
            console.error('Error parsing questions:', e);
            questions = [];
        }

        if (questions.length === 0) {
            return (
                <div className="p-6 max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-6">{selectedTest.title}</h1>
                    <div className="bg-white p-12 rounded-lg shadow text-slate-900">
                        <p className="text-slate-600 text-xl mb-6">No questions available for this test yet.</p>
                        <button
                            onClick={() => setSelectedTest(null)}
                            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-6 max-w-4xl mx-auto text-slate-900">
                <h1 className="text-3xl font-bold mb-6 text-white">{selectedTest.title}</h1>
                <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-white/10">
                    {questions.map((q, idx) => {
                        // Defensive property access for inconsistent AI responses
                        const questionText = q.question || q.Question || q.text || 'Missing question text';
                        const options = q.options || q.Options || q.choices || [];

                        return (
                            <div key={idx} className="mb-6 pb-6 border-b last:border-0">
                                <p className="font-semibold mb-3">Q{idx + 1}. {questionText}</p>
                                <div className="space-y-2">
                                    {options.map((option, optIdx) => (
                                        <label key={optIdx} className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-gray-50 p-2 rounded">
                                            <input
                                                type="radio"
                                                name={`q${idx}`}
                                                value={option}
                                                onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={submitTest}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all"
                        >
                            Submit Test
                        </button>
                        <button
                            onClick={() => setSelectedTest(null)}
                            className="bg-gray-100 text-gray-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Tests</h1>
            <div className="grid gap-4">
                {tests.map(test => (
                    <div key={test.id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5" />
                                    {test.title}
                                </h3>
                                <p className="text-gray-600 mt-2">Topic: {test.topic}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                                    <Clock className="w-4 h-4" />
                                    Due: {new Date(test.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => startTest(test)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Start Test
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentTests;
