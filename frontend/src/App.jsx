import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginV2';
import StudentRegister from './pages/StudentRegister';
import InstructorRegister from './pages/InstructorRegister';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import ManageCourses from './pages/ManageCourses';
import CreateCourse from './pages/CreateCourse';
import ViewCourse from './pages/ViewCourse';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register/student" element={<StudentRegister />} />
                <Route path="/register/instructor" element={<InstructorRegister />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                <Route path="/manage-courses" element={<ManageCourses />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/view-course/:id" element={<ViewCourse />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
