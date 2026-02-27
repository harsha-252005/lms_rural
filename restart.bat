@echo off
echo Restarting Backend with Assignment/Test Features...
cd /d "%~dp0"

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /F /PID %%a >nul 2>&1

timeout /t 2 /nobreak >nul

echo Starting backend...
mvn spring-boot:run
