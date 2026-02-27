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
        const questions = JSON.parse(selectedTest.questions);
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{selectedTest.title}</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    {questions.map((q, idx) => (
                        <div key={idx} className="mb-6 pb-6 border-b last:border-0">
                            <p className="font-semibold mb-3">Q{idx + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((option, optIdx) => (
                                    <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`q${idx}`}
                                            value={option}
                                            onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                                            className="w-4 h-4"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={submitTest}
                        className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
                    >
                        Submit Test
                    </button>
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
