@echo off
echo Starting Backend...
cd /d "%~dp0"
start "LMS Backend" cmd /k "mvn spring-boot:run"
timeout /t 15 /nobreak
echo Backend started on http://localhost:8080
