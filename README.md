# 🎓 LMS for Rural - Learning Management System

A comprehensive Learning Management System designed for rural education, featuring automated course enrollment, AI-generated testing, and streamlined instructor/student dashboards. Built with a robust Spring Boot backend and a modern React frontend.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Database**: MySQL (lms_db)
- **Security**: Spring Security
- **API Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Utilities**: Lombok, Spring Data JPA, Hibernate

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS, Framer Motion (Animations)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **API Client**: Axios

---

## 🎯 Key Features

- **Instructor Dashboard**: 
    - Create and manage courses with video uploads.
    - Track course status (Draft/Published).
    - AI-generated test questions based on course topics.
- **Student Dashboard**:
    - Automatic enrollment based on class level (for Published courses).
    - Interactive course viewing and progress tracking.
    - Online assessments with real-time feedback.
- **AI Integration**:
    - Automated test generation using Gemini AI services.
- **Data Flow**: Optimized repository-level data fetching to prevent circular references and lazy-loading issues.

---

## 🚀 Getting Started

### Prerequisites
- Java 17 JDK
- Node.js (v18+)
- MySQL Server

### 1. Backend Setup
1.  Configure `src/main/resources/application.properties` with your MySQL credentials.
2.  Run the backend:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
3.  Access Swagger UI at: `http://localhost:8080/swagger-ui/index.html`

### 2. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
2.  Open `http://localhost:5173` in your browser.

---

## 🗂️ Project Structure

```text
lms-for-rural/
├── src/main/java/com/example/demo/    # Backend Source
│   ├── controller/                    # API Endpoints
│   ├── service/                       # Business Logic
│   ├── repository/                    # Database Operations
│   └── model/                         # Entity Definitions
├── frontend/                          # React Frontend
│   ├── src/pages/                     # Dashboard & UI Pages
│   └── src/components/                # Reusable UI Components
├── API_TESTING_GUIDE.md               # How to test endpoints
├── START_HERE.md                      # Quick setup guide
└── README_REFACTORING.md              # Detailed refactoring notes
```

---

## 📚 Documentation Reference

For more detailed information, please refer to:
- [🚀 Quick Start Guide](file:///c:/Users/nirru/OneDrive/Desktop/lms%20for%20rural/lms-for-rural/START_HERE.md)
- [📝 API Testing Guide](file:///c:/Users/nirru/OneDrive/Desktop/lms%20for%20rural/lms-for-rural/API_TESTING_GUIDE.md)
- [🧩 Frontend API Reference](file:///c:/Users/nirru/OneDrive/Desktop/lms%20for%20rural/lms-for-rural/FRONTEND_API_REFERENCE.md)
- [🔧 Troubleshooting Guide](file:///c:/Users/nirru/OneDrive/Desktop/lms%20for%20rural/lms-for-rural/TROUBLESHOOTING_GUIDE.md)

---

## ✅ Success Criteria
1.  **Instructor** can create a course and see it in "Manage Courses".
2.  **Student** sees enrolled courses automatically upon login (matching classLevel).
3.  **AI Tests** are generated correctly for new courses.
4.  **No console errors** in browser or backend logs.
