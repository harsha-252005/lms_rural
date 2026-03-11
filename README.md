# 🎓 RuralLMS — AI-Powered Learning Management System

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Spring Security](https://img.shields.io/badge/Security-Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity)](https://spring.io/projects/spring-security)

**RuralLMS** is a comprehensive Learning Management System designed to bridge the educational divide in rural and underserved communities. With an intuitive interface, automated assessment generation, and real-time performance tracking, RuralLMS transforms traditional learning into an accessible, modern digital experience.

---

## ✨ Key Features

### 📚 Course Management
- **Instructor Dashboard**: Create, publish, and manage multimedia-rich courses with video content
- **Class-Based Organization**: Courses organized by class levels (1-12) for targeted learning
- **Video Lessons**: Upload and manage video content with thumbnail support
- **Course Enrollment**: Students can enroll in courses matching their class level
- **Progress Tracking**: Real-time tracking of student progress and course completion

### 📝 Assignments & Tests System
- **Assignment Creation**: Instructors create assignments for specific class levels
- **Auto-Generated Tests**: Tests with automatically generated questions based on topics:
  - Mathematics (15 questions)
  - Science (15 questions)
  - English (15 questions)
  - History (10 questions)
- **Student Submissions**: Students submit assignments and take tests online
- **Auto-Evaluation**: Tests are automatically graded with instant score calculation
- **Submission Tracking**: Instructors view all submissions with scores and evaluation details

### 👨🎓 Student Portal
- **Personalized Dashboard**: View enrolled courses, assignments, and tests
- **Course Access**: Browse and enroll in courses for your class level
- **Assignment Submission**: Submit text-based assignment answers
- **Interactive Tests**: Take multiple-choice tests with instant results
- **Profile Management**: Update personal information and track learning statistics
- **Progress Overview**: View completion status and performance metrics

### 👨🏫 Instructor Portal
- **Course Studio**: Create courses with title, description, category, and class level
- **Video Management**: Upload lesson videos and thumbnails
- **Assignment Creator**: Design assignments with descriptions and due dates
- **Test Generator**: Create tests with auto-generated questions by topic
- **Student Management**: View enrolled students and their progress
- **Submission Review**: Access all student submissions with scores and answers

### 🔐 Authentication & Security
- **Role-Based Access**: Separate portals for students and instructors
- **Spring Security**: Secure authentication with CORS configuration
- **Session Management**: Persistent login with localStorage
- **Protected Routes**: Role-specific access control

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Sophisticated interface with gradients and depth
- **Framer Motion Animations**: Smooth transitions and micro-interactions
- **Lucide React Icons**: Modern, consistent iconography
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Eye-friendly dark mode interface

---

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE lms_db;
```

### 2. Backend Setup
```bash
# From the root directory
mvn clean install
mvn spring-boot:run
```
**Backend runs on:** http://localhost:8080
**API Documentation:** http://localhost:8080/swagger-ui/index.html

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
**Frontend runs on:** http://localhost:5173

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register/student` - Register new student
- `POST /api/auth/register/instructor` - Register new instructor
- `POST /api/auth/login` - Login (student/instructor)

### Courses
- `GET /api/courses` - Get all published courses
- `POST /api/courses` - Create new course (instructor)
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses/{id}/enroll` - Enroll in course (student)

### Assignments
- `POST /api/instructor/assignments` - Create assignment
- `GET /api/instructor/assignments?instructorId={id}` - Get instructor's assignments
- `GET /api/student/{studentId}/assignments` - Get student's assignments
- `POST /api/student/assignments/submit` - Submit assignment
- `GET /api/instructor/assignments/{id}/submissions` - View submissions

### Tests
- `POST /api/instructor/tests` - Create test (auto-generates questions)
- `GET /api/instructor/tests?instructorId={id}` - Get instructor's tests
- `GET /api/student/{studentId}/tests` - Get student's tests
- `POST /api/student/tests/submit` - Submit test (auto-evaluated)
- `GET /api/instructor/tests/{id}/submissions` - View test results

### Students
- `GET /api/students/{id}` - Get student profile
- `PUT /api/students/{id}` - Update student profile
- `GET /api/students/{id}/my-courses` - Get enrolled courses

---

## 🛠️ Technical Stack

### Backend
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Security**: Spring Security 6.2.2
- **Database**: MySQL 8.0 with Hibernate/JPA
- **API Documentation**: SpringDoc OpenAPI 3.0
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Database Schema
- **students** - Student information and credentials
- **instructors** - Instructor information and credentials
- **courses** - Course details and metadata
- **lessons** - Video lessons for courses
- **enrollments** - Student course enrollments
- **assignments** - Assignment details
- **tests** - Test details with questions
- **assignment_submissions** - Student assignment submissions
- **test_submissions** - Student test submissions with scores
- **activity_logs** - User activity tracking

---

## 📁 Project Structure

```
lms-for-rural/
├── src/main/java/com/example/demo/
│   ├── config/          # Security and CORS configuration
│   ├── controller/      # REST API controllers
│   ├── dto/             # Data Transfer Objects
│   ├── model/           # JPA Entity models
│   ├── repository/      # Database repositories
│   ├── service/         # Business logic services
│   └── exception/       # Exception handlers
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── utils/       # API utilities
│   │   └── App.jsx      # Main application
│   └── public/          # Static assets
├── uploads/             # Uploaded course materials
└── README.md
```

---

## 🎯 Usage Guide

### For Students
1. **Register**: Create account with name, email, password, and class level
2. **Login**: Access student dashboard
3. **Browse Courses**: View courses for your class level
4. **Enroll**: Join courses and start learning
5. **Watch Videos**: Access course lessons and videos
6. **Complete Assignments**: Submit assignment answers
7. **Take Tests**: Answer auto-generated questions and get instant scores
8. **Track Progress**: Monitor your learning journey

### For Instructors
1. **Register**: Create account with name, email, password, and specialization
2. **Login**: Access instructor dashboard
3. **Create Courses**: Add courses with videos and materials
4. **Create Assignments**: Design assignments for specific classes
5. **Generate Tests**: Create tests with auto-generated questions
6. **Monitor Students**: View enrolled students and their progress
7. **Review Submissions**: Check assignment submissions and test scores
8. **Track Performance**: Analyze student performance metrics

---

## 🔧 Configuration

### Database Configuration (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lms_db
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

### Frontend API Configuration (vite.config.js)
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true
  }
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👨💻 Author

**Built with ❤️ for rural education by Harsha**

---

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**RuralLMS** - Empowering rural education through technology 🚀
