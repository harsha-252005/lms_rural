@echo off
echo Starting LMS Application...
cd /d "%~dp0"

echo Starting Backend...
start "Backend" cmd /k "java -jar target\lms-for-rural-0.0.1-SNAPSHOT.jar"

timeout /t 10 /nobreak

echo Starting Frontend...
cd frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Application started!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
