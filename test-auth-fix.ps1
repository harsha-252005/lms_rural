# Test Registration and Login
Write-Host "Testing Registration and Login..." -ForegroundColor Green

# Test Student Registration
Write-Host "`nTesting Student Registration..." -ForegroundColor Yellow
$studentReg = @{
    name = "Test Student"
    email = "teststudent@example.com"
    password = "password123"
    classLevel = "10"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register/student" `
    -Method POST `
    -ContentType "application/json" `
    -Body $studentReg `
    -UseBasicParsing

Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
Write-Host "Response: $($response.Content)" -ForegroundColor Cyan

# Test Student Login
Write-Host "`nTesting Student Login..." -ForegroundColor Yellow
$studentLogin = @{
    email = "teststudent@example.com"
    password = "password123"
    role = "STUDENT"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $studentLogin `
    -UseBasicParsing

Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
Write-Host "Response: $($response.Content)" -ForegroundColor Cyan

Write-Host "`nTests completed!" -ForegroundColor Green
