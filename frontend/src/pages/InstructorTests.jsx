import { useState, useEffect } from 'react';
import { Plus, ClipboardCheck, Eye, Sparkles, Pencil, Check, X, RefreshCw, Loader2, ArrowLeft, Trophy, User, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

const InstructorTests = () => {
    const [tests, setTests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [step, setStep] = useState('form'); // 'form' | 'generating' | 'review'
    const [formData, setFormData] = useState({
        title: '',
        topic: 'math',
        classLevel: '',
        totalMarks: 10,
        dueDate: ''
    });
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [viewingResults, setViewingResults] = useState(null); // { test, submissions }
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            if (!user?.id) return;
            const res = await api.get(`/instructor/tests?instructorId=${user.id}`);
            setTests(res.data);
        } catch (error) {
            console.error('Error loading tests:', error);
        }
    };

    // Step 1: Generate questions (preview only, not saved)
    const handleGenerate = async (e) => {
        e.preventDefault();
        setStep('generating');
        try {
            const res = await api.post('/instructor/tests/generate', {
                title: formData.title,
                topic: formData.topic
            });
            let questions = [];
            if (typeof res.data === 'string') {
                questions = JSON.parse(res.data);
            } else {
                questions = res.data;
            }
            setGeneratedQuestions(questions);
            setStep('review');
        } catch (error) {
            console.error('Error generating questions:', error);
            alert('Error generating questions. Please try again.');
            setStep('form');
        }
    };

    // Step 2: Publish the (possibly edited) test
    const handlePublish = async () => {
        try {
            const payload = {
                ...formData,
                instructorId: user.id,
                questions: JSON.stringify(generatedQuestions)
            };
            await api.post('/instructor/tests', payload);
            alert('Test published successfully!');
            resetForm();
            loadTests();
        } catch (error) {
            console.error('Error publishing test:', error);
            alert('Error publishing test.');
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setStep('form');
        setFormData({ title: '', topic: 'math', classLevel: '', totalMarks: 10, dueDate: '' });
        setGeneratedQuestions([]);
    };

    // Editing helpers
    const updateQuestion = (idx, field, value) => {
        const updated = [...generatedQuestions];
        updated[idx] = { ...updated[idx], [field]: value };
        setGeneratedQuestions(updated);
    };

    const updateOption = (qIdx, optIdx, value) => {
        const updated = [...generatedQuestions];
        const newOptions = [...(updated[qIdx].options || [])];
        newOptions[optIdx] = value;
        updated[qIdx] = { ...updated[qIdx], options: newOptions };
        setGeneratedQuestions(updated);
    };

    const removeQuestion = (idx) => {
        setGeneratedQuestions(generatedQuestions.filter((_, i) => i !== idx));
    };

    // View Results - fetch submissions and show detailed results
    const viewSubmissions = async (test) => {
        try {
            const res = await api.get(`/instructor/tests/${test.id}/submissions`);
            setViewingResults({ test, submissions: res.data });
        } catch (error) {
            console.error('Error loading submissions:', error);
            alert('Error loading submissions');
        }
    };

    // ==================== RESULTS VIEW ====================
    if (viewingResults) {
        const { test, submissions } = viewingResults;
        let testQuestions = [];
        try {
            testQuestions = JSON.parse(test.questions || '[]');
        } catch (e) {
            testQuestions = [];
        }

        return (
            <div className="p-6">
                <button
                    onClick={() => setViewingResults(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Tests
                </button>

                <h1 className="text-3xl font-bold mb-2">{test.title} - Results</h1>
                <p className="text-slate-400 mb-6">Topic: {test.topic} | Class: {test.classLevel} | Total Marks: {test.totalMarks}</p>

                {submissions.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl shadow-lg text-center text-slate-900">
                        <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-600 mb-2">No Submissions Yet</h2>
                        <p className="text-slate-400">Students haven't submitted this test yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-lg text-slate-900 text-center">
                                <p className="text-3xl font-bold text-indigo-600">{submissions.length}</p>
                                <p className="text-slate-500 text-sm mt-1">Total Submissions</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg text-slate-900 text-center">
                                <p className="text-3xl font-bold text-green-600">
                                    {submissions.length > 0
                                        ? (submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length).toFixed(1)
                                        : 0}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">Average Score</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg text-slate-900 text-center">
                                <p className="text-3xl font-bold text-amber-600">
                                    {submissions.length > 0
                                        ? Math.max(...submissions.map(s => s.score || 0))
                                        : 0}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">Highest Score</p>
                            </div>
                        </div>

                        {/* Individual Student Results */}
                        {submissions.map((submission, sIdx) => {
                            let evaluation = [];
                            try {
                                evaluation = JSON.parse(submission.evaluation || '[]');
                            } catch (e) {
                                evaluation = [];
                            }

                            let studentAnswers = [];
                            try {
                                studentAnswers = JSON.parse(submission.answers || '[]');
                            } catch (e) {
                                studentAnswers = [];
                            }

                            const percentage = submission.totalMarks > 0
                                ? Math.round((submission.score / submission.totalMarks) * 100)
                                : 0;

                            return (
                                <div key={sIdx} className="bg-white rounded-2xl shadow-lg text-slate-900 overflow-hidden">
                                    {/* Student Header */}
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <User className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">Student ID: {submission.studentId}</h3>
                                                <p className="text-sm text-slate-400">
                                                    Submitted: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-3xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                                {submission.score}/{submission.totalMarks}
                                            </p>
                                            <p className="text-sm text-slate-400">{percentage}%</p>
                                        </div>
                                    </div>

                                    {/* Detailed Answers */}
                                    <div className="p-6">
                                        <h4 className="font-semibold text-slate-600 mb-4 text-sm uppercase tracking-wider">Answer Details</h4>
                                        <div className="space-y-3">
                                            {evaluation.map((evalItem, eIdx) => {
                                                const question = testQuestions[eIdx] || {};
                                                const qText = question.question || question.Question || `Question ${eIdx + 1}`;

                                                return (
                                                    <div
                                                        key={eIdx}
                                                        className={`p-4 rounded-xl border ${evalItem.correct
                                                            ? 'bg-green-50 border-green-200'
                                                            : 'bg-red-50 border-red-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {evalItem.correct ? (
                                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                            ) : (
                                                                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-slate-800 text-sm">Q{eIdx + 1}. {qText}</p>
                                                                <div className="mt-1 text-sm">
                                                                    <span className="text-slate-500">Student's Answer: </span>
                                                                    <span className={evalItem.correct ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                                                                        {evalItem.studentAnswer || '(No answer)'}
                                                                    </span>
                                                                </div>
                                                                {!evalItem.correct && (
                                                                    <div className="mt-1 text-sm">
                                                                        <span className="text-slate-500">Correct Answer: </span>
                                                                        <span className="text-green-700 font-medium">{evalItem.correctAnswer}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // ==================== MAIN VIEW ====================
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tests</h1>
                {!showForm && (
                    <button
                        onClick={() => { setShowForm(true); setStep('form'); }}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
                    >
                        <Plus className="w-5 h-5" />
                        Create Test
                    </button>
                )}
            </div>

            {/* STEP 1: Form to fill test details */}
            {showForm && step === 'form' && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 text-slate-900 border border-slate-100">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm text-indigo-800 font-medium">
                            Questions will be generated based on your title & topic. You can review and edit them before publishing!
                        </span>
                    </div>
                    <form onSubmit={handleGenerate}>
                        <input
                            type="text"
                            placeholder="Test Title (e.g. Introduction to Plants)"
                            className="w-full border border-slate-200 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <select
                            className="w-full border border-slate-200 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        >
                            <option value="math">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="english">English</option>
                            <option value="history">History</option>
                        </select>
                        <select
                            className="w-full border border-slate-200 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all"
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
                            className="w-full border border-slate-200 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all"
                            value={formData.totalMarks}
                            onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                            required
                        />
                        <input
                            type="datetime-local"
                            className="w-full border border-slate-200 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                        <div className="flex gap-3 mt-2">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                            >
                                <Sparkles className="w-5 h-5" />
                                Generate Questions
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 1.5: Loading state */}
            {showForm && step === 'generating' && (
                <div className="bg-white p-12 rounded-2xl shadow-2xl mb-8 text-slate-900 border border-slate-100 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Generating Questions...</h2>
                    <p className="text-slate-500">Creating questions based on "{formData.title}" ({formData.topic})</p>
                </div>
            )}

            {/* STEP 2: Review & Edit questions */}
            {showForm && step === 'review' && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 text-slate-900 border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <Pencil className="w-6 h-6 text-indigo-600" />
                                Review & Edit Questions
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Edit any question, option, or correct answer below. Remove questions you don't want. Click "Publish" when ready.
                            </p>
                        </div>
                        <button
                            onClick={() => { setStep('form'); setGeneratedQuestions([]); }}
                            className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Re-generate
                        </button>
                    </div>

                    <div className="space-y-6">
                        {generatedQuestions.map((q, idx) => {
                            const questionText = q.question || q.Question || q.text || '';
                            const options = q.options || q.Options || q.choices || [];
                            const correctAnswer = q.correctAnswer || q.correct_answer || q.answer || '';

                            return (
                                <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 relative group">
                                    <button
                                        onClick={() => removeQuestion(idx)}
                                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove question"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1 block">
                                        Question {idx + 1}
                                    </label>
                                    <input
                                        type="text"
                                        value={questionText}
                                        onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg p-2.5 mb-3 font-medium focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none bg-white"
                                    />

                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                                        Options
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {options.map((opt, optIdx) => (
                                            <input
                                                key={optIdx}
                                                type="text"
                                                value={opt}
                                                onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                                                className={`border rounded-lg p-2 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-300 ${opt === correctAnswer
                                                        ? 'border-green-400 bg-green-50 ring-1 ring-green-300'
                                                        : 'border-slate-200 bg-white'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1 block">
                                        Correct Answer
                                    </label>
                                    <select
                                        value={correctAnswer}
                                        onChange={(e) => updateQuestion(idx, 'correctAnswer', e.target.value)}
                                        className="w-full border border-green-300 rounded-lg p-2 text-sm bg-green-50 focus:ring-2 focus:ring-green-300 outline-none"
                                    >
                                        {options.map((opt, optIdx) => (
                                            <option key={optIdx} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                        <button
                            onClick={handlePublish}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-500/25"
                        >
                            <Check className="w-5 h-5" />
                            Confirm & Publish Test ({generatedQuestions.length} questions)
                        </button>
                        <button
                            onClick={resetForm}
                            className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            )}

            {/* Existing tests list */}
            <div className="grid gap-6">
                {tests.map(test => (
                    <div key={test.id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-slate-900">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                                    {test.title}
                                </h3>
                                <p className="text-slate-600 mt-2">Topic: {test.topic}</p>
                                <p className="text-sm text-slate-500 mt-1">Class: {test.classLevel} | Marks: {test.totalMarks}</p>
                            </div>
                            <button
                                onClick={() => viewSubmissions(test)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-all"
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
