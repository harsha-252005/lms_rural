import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstructorDashboard from './pages/InstructorDashboard';
import ManageCourses from './pages/ManageCourses';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-slate-50 font-sans">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                        <Routes>
                            <Route path="/" element={<InstructorDashboard />} />
                            <Route path="/manage-courses" element={<ManageCourses />} />
                            {/* Add more routes as needed */}
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';
import InstructorRegister from './pages/InstructorRegister';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/instructor" element={<InstructorRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
