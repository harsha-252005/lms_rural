@echo off
title LMS Application
cd /d "%~dp0"

echo Killing old processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %%a >nul 2>&1

echo Starting Backend with Maven...
start "Backend" cmd /k "mvn spring-boot:run"

timeout /t 15 /nobreak >nul

echo Starting Frontend...
cd frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Application started!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
pause
