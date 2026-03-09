# 🎓 RuralLMS — Bridging the Educational Divide

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

RuralLMS is a mission-driven Learning Management System designed to bring world-class education to rural and underserved communities. By combining automated enrollment, AI-driven assessment, and a streamlined user experience, we ensure that geography is no longer a barrier to knowledge.

---

## 📑 Table of Contents
- [🚀 Rapid Onboarding](#-rapid-onboarding)
- [✨ Key Modules](#-key-modules)
- [🌟 Our Mission](#-our-mission)
- [🛠️ Technical Architecture](#-technical-architecture)
- [🗺️ Technical Map](#-technical-map)
- [🧩 Project Ecosystem](#-project-ecosystem)
- [📚 Resource Library](#-resource-library)

---

## 🚀 Rapid Onboarding

### 1. Backend Launch
```bash
# From the root directory
mvn clean install
mvn spring-boot:run
```
*Swagger UI: http://localhost:8080/swagger-ui/index.html*

### 2. Frontend Launch
```bash
cd frontend
npm install
npm run dev
```
*Access Portal: http://localhost:5173*

---

## ✨ Key Modules

### 👨‍🏫 Instructor Suite
- **Course Studio**: Create, draft, and publish multimedia courses.
- **AI Assessment Engine**: Generate smart test questions based on course content.
- **Student Management**: Oversee progress and engagement across different class levels.

### 🎓 Student Experience
- **Smart Enrollment**: Log in and instantly see courses relevant to your class level.
- **Learning Path**: Interactive video player and progress tracking.
- **Instant Assessments**: Take AI-generated tests and receive immediate results.

---

## 🌟 Our Mission
In many rural areas, high-quality educational resources are scarce. **RuralLMS** addresses this by:
- Providing a **centralized portal** for digital learning.
- Automating **class-level enrollment** to simplify access for students.
- Leveraging **AI (Gemini)** to generate high-quality assessments instantly.
- Supporting **video-based learning** tailored for low-bandwidth environments.

---

## 🛠️ Technical Architecture

### 🛡️ Backend Layer
- **Engine**: Spring Boot 3.2.3 (Java 17)
- **Security**: Robust Spring Security integration.
- **Persistence**: MySQL via Hibernate/JPA.
- **API Specs**: SpringDoc OpenAPI (Swagger).
- **Automation**: Repository-level data flow optimization for performance.

### 🎨 Frontend Layer
- **Core**: React 18 powered by Vite.
- **Design**: Premium Glassmorphism UI with TailwindCSS.
- **Interactions**: Fluid animations via Framer Motion.
- **Iconography**: Clean, semantic icons from Lucide React.
- **Communication**: Promise-based Axios architecture.

---

## 🗺️ Technical Map
```text
lms-for-rural/
├── src/main/java/com/example/demo/    # Root Package
│   ├── controller/                    # API Entry Points
│   ├── service/                       # Business Logic Layer
│   ├── repository/                    # Data Access
│   └── model/                         # Domain Entities
├── frontend/                          # React Core
│   ├── src/pages/                     # Application Routes
│   └── src/components/                # UI Primitives
└── ...
```

---

## 🧩 Project Ecosystem

| File | Purpose |
|------|---------|
| `src/` | Java Backend source code (Controller-Service-Repository pattern). |
| `frontend/` | React application source code. |
| `API_TESTING_GUIDE.md` | Comprehensive instructions for endpoint verification. |
| `START_HERE.md` | The primary onboarding guide for developers. |
| `FRONTEND_API_REFERENCE.md` | Documentation for frontend-backend integration. |

---

## 📚 Resource Library
- [🚀 Quick Start Guide](START_HERE.md) — Get running in 5 minutes.
- [📝 API Testing Guide](API_TESTING_GUIDE.md) — Test your setup.
- [🧩 Frontend Reference](FRONTEND_API_REFERENCE.md) — Developer docs.
- [🔧 Troubleshooting](TROUBLESHOOTING_GUIDE.md) — Common fixes.

---

*Built with ❤️ for rural education by Harsha*
