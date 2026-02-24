import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginV2';
import StudentRegister from './pages/StudentRegister';
import InstructorRegister from './pages/InstructorRegister';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorSettings from './pages/InstructorSettings';
import InstructorStudents from './pages/InstructorStudents';
import ManageCourses from './pages/ManageCourses';
import MyCourses from './pages/MyCourses';

// App component managing the main routing of the LMS
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register/student" element={<StudentRegister />} />
                <Route path="/register/instructor" element={<InstructorRegister />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                <Route path="/instructor/settings" element={<InstructorSettings />} />
                <Route path="/instructor/students" element={<InstructorStudents />} />
                <Route path="/manage-courses" element={<ManageCourses />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/instructor" element={<InstructorRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/my-courses" element={<MyCourses />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
