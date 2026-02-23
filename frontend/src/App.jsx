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
}

export default App;
