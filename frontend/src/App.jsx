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
import CreateCourse from './pages/CreateCourse';
import ViewCourse from './pages/ViewCourse';
import MyCourses from './pages/MyCourses';
import StudentAssignments from './pages/StudentAssignments';
import StudentTests from './pages/StudentTests';
import InstructorAssignments from './pages/InstructorAssignments';
import InstructorTests from './pages/InstructorTests';
import StudentProfile from './pages/StudentProfile';

// App component managing the main routing of the LMS
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/instructor" element={<InstructorRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/my-courses" element={<MyCourses />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/tests" element={<StudentTests />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/settings" element={<InstructorSettings />} />
        <Route path="/instructor/students" element={<InstructorStudents />} />
        <Route path="/instructor/assignments" element={<InstructorAssignments />} />
        <Route path="/instructor/tests" element={<InstructorTests />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/view-course/:id" element={<ViewCourse />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
