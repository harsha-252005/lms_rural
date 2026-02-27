@echo off
cd /d "%~dp0"
echo Starting Backend (No Security)...
java -jar target\lms-for-rural-0.0.1-SNAPSHOT.jar
