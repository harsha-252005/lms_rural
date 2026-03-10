# 🎓 RuralLMS — The Premium AI-Driven Learning Revolution

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%20Pro-8E75B2?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Premium UI](https://img.shields.io/badge/UI-Glassmorphism%20v2-FF6B6B?style=for-the-badge&logo=vercel)](https://vercel.app/)

**RuralLMS** is a state-of-the-art, mission-driven Learning Management System designed to bridge the educational divide in rural and underserved communities. Featuring a premium, animated interface and powered by the latest in Generative AI, RuralLMS transforms traditional learning into an accessible, world-class digital experience.

---

## ✨ Premium Features

### 🧠 Dynamic AI Assessment Engine
Leverage the power of **Google Gemini Pro** to instantly generate high-quality, topic-specific test questions. No more manual question entry—simply define a topic, and our AI crafts a comprehensive assessment with distractors and correct answers, tailored to the student's level.

### 🎨 State-of-the-Art UI/UX
- **Glassmorphism Design**: A sophisticated, translucent interface with vibrant gradients and subtle depth.
- **Micro-Animations**: Fluid transitions powered by **Framer Motion** for a responsive, "alive" feel.
- **Custom Iconography**: Beautifully curated icons from **Lucide React** for an intuitive, modern navigation experience.
- **Premium Login Experience**: A stunning entry portal featuring inspirational quotes and a "dock-style" navigation.

### 👨‍🏫 Instructor Command Center
- **Course Studio**: An advanced workspace to create, publish, and manage multimedia-rich courses.
- **Smart Enrollment**: Automated tools to oversee student growth and engagement across diverse class levels.
- **Integrated Feedback**: Instant result tracking and performance analytics.

### 🎓 Next-Gen Student Portal
- **Zero-Barrier Access**: Log in and immediately see personalized course materials based on your class level.
- **Interactive Theater**: A seamless video-based learning environment optimized for all connectivity speeds.
- **Real-Time Evaluations**: Take AI-generated tests and receive immediate, actionable performance reports.

---

## 🚀 Get Started

### 1. Launch the Engine (Backend)
```bash
# From the root directory
mvn clean install
mvn spring-boot:run
```
*API Documentation: http://localhost:8080/swagger-ui/index.html*

### 2. Enter the Portal (Frontend)
```bash
cd frontend
npm install
npm run dev
```
*Live Experience: http://localhost:5173*

---

## 🛠️ Technical Architecture

### 🛡️ Robust Backend
- **Core**: Spring Boot 3.2.3 (Java 17)
- **Security**: Advanced Spring Security integration for role-based access control.
- **Intelligence**: Google Gemini API for dynamic content and assessment generation.
- **Data**: MySQL via Hibernate/JPA, with H2 support for rapid development.

### 🎨 Fluid Frontend
- **Core**: React 18 + Vite for lightning-fast performance.
- **Styling**: Tailored TailwindCSS implementation for consistent, premium aesthetics.
- **Logic**: Axios-based asynchronous data flow with centralized API management.

---

## 🗺️ Project Ecosystem

| Module | Purpose |
|:---|:---|
| `src/` | Java Backend: Controller-Service-Repository architecture. |
| `frontend/` | React Core: Premium components and pages. |
| `API_TESTING_GUIDE.md` | Comprehensive guide for end-to-end API verification. |
| `START_HERE.md` | The definitive onboarding path for new contributors. |
| `FRONTEND_API_REFERENCE.md` | Deep-dive into the bridge between UI and Data. |

---

*Built with ❤️ and AI for rural education by Harsha*
