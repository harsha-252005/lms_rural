@echo off
title LMS Application
cd /d "%~dp0"

echo ========================================
echo   Starting LMS Application
echo ========================================
echo.

REM Kill any existing processes
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %%a >nul 2>&1

echo [1/2] Starting Backend on port 8080...
start "LMS Backend" /MIN cmd /c "java -jar target\lms-for-rural-0.0.1-SNAPSHOT.jar"

echo [2/2] Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo [3/3] Starting Frontend on port 5173...
cd frontend
start "LMS Frontend" /MIN cmd /c "npm run dev"
cd ..

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo ========================================
echo.
pause
