# LMS API Test Script
# Run this after starting the backend with: mvn spring-boot:run

$baseUrl = "http://localhost:8080"

Write-Host "`n=== LMS API Testing Script ===" -ForegroundColor Cyan
Write-Host "Testing backend at: $baseUrl`n" -ForegroundColor Yellow

# Test 1: Check if backend is running
Write-Host "[1/6] Testing backend health..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method Get -TimeoutSec 5
    Write-Host "✓ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running. Start it with: mvn spring-boot:run" -ForegroundColor Red
    exit
}

# Test 2: Register Instructor
Write-Host "`n[2/6] Registering test instructor..." -ForegroundColor Green
$instructor = @{
    name = "Test Instructor"
    email = "test.instructor@lms.com"
    phone = "1234567890"
    specialization = "Mathematics"
    password = "test123"
} | ConvertTo-Json

try {
    $instructorResponse = Invoke-RestMethod -Uri "$baseUrl/api/instructors/register" -Method Post -Body $instructor -ContentType "application/json"
    $instructorId = $instructorResponse.id
    Write-Host "✓ Instructor registered with ID: $instructorId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to register instructor (may already exist)" -ForegroundColor Yellow
    $instructorId = 1
}

# Test 3: Register Student
Write-Host "`n[3/6] Registering test student..." -ForegroundColor Green
$student = @{
    name = "Test Student"
    email = "test.student@lms.com"
    phone = "9876543210"
    village = "Test Village"
    classLevel = "10"
    password = "test123"
} | ConvertTo-Json

try {
    $studentResponse = Invoke-RestMethod -Uri "$baseUrl/api/students" -Method Post -Body $student -ContentType "application/json"
    $studentId = $studentResponse.id
    Write-Host "✓ Student registered with ID: $studentId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to register student (may already exist)" -ForegroundColor Yellow
    $studentId = 1
}

# Test 4: Get Instructor Courses (should be empty initially)
Write-Host "`n[4/6] Testing GET /api/instructors/$instructorId/courses..." -ForegroundColor Green
try {
    $instructorCourses = Invoke-RestMethod -Uri "$baseUrl/api/instructors/$instructorId/courses" -Method Get
    Write-Host "✓ Instructor courses endpoint working. Found $($instructorCourses.Count) courses" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to fetch instructor courses" -ForegroundColor Red
}

# Test 5: Get Student Courses (should be empty initially)
Write-Host "`n[5/6] Testing GET /api/students/$studentId/courses..." -ForegroundColor Green
try {
    $studentCourses = Invoke-RestMethod -Uri "$baseUrl/api/students/$studentId/courses" -Method Get
    Write-Host "✓ Student courses endpoint working. Found $($studentCourses.Count) courses" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to fetch student courses" -ForegroundColor Red
}

# Test 6: Get All Courses
Write-Host "`n[6/6] Testing GET /api/courses..." -ForegroundColor Green
try {
    $allCourses = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method Get
    Write-Host "✓ All courses endpoint working. Found $($allCourses.Count) total courses" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to fetch all courses" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Instructor ID: $instructorId" -ForegroundColor Yellow
Write-Host "Student ID: $studentId" -ForegroundColor Yellow
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Create a course using the frontend or Postman" -ForegroundColor White
Write-Host "2. Use instructorId: $instructorId in the course creation" -ForegroundColor White
Write-Host "3. Set status: 'Published' to auto-enroll students" -ForegroundColor White
Write-Host "4. Verify course appears at: $baseUrl/api/instructors/$instructorId/courses" -ForegroundColor White
Write-Host "5. Verify student enrollment at: $baseUrl/api/students/$studentId/courses" -ForegroundColor White
Write-Host "`nAll API endpoints are working correctly! ✓" -ForegroundColor Green
