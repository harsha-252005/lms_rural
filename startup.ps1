# LMS Complete Startup Script

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          LMS FOR RURAL - COMPLETE STARTUP                   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$projectPath = "c:\Users\nirru\OneDrive\Desktop\lms for rural\lms-for-rural"

# Check MySQL
Write-Host "[1/4] Checking MySQL..." -ForegroundColor Yellow
$mysqlStatus = sc.exe query MySQL80 | Select-String "STATE"
if ($mysqlStatus -match "RUNNING") {
    Write-Host "✓ MySQL is running" -ForegroundColor Green
} else {
    Write-Host "✗ MySQL is not running. Starting..." -ForegroundColor Red
    Start-Service MySQL80
    Start-Sleep -Seconds 3
    Write-Host "✓ MySQL started" -ForegroundColor Green
}

# Check Backend Compilation
Write-Host "`n[2/4] Checking backend..." -ForegroundColor Yellow
Set-Location $projectPath
$compileResult = mvn clean compile -q 2>&1 | Select-String "BUILD SUCCESS"
if ($compileResult) {
    Write-Host "✓ Backend compiled successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Backend compilation failed" -ForegroundColor Red
    exit
}

# Check Frontend Dependencies
Write-Host "`n[3/4] Checking frontend..." -ForegroundColor Yellow
Set-Location "$projectPath\frontend"
if (Test-Path "node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

# Instructions
Write-Host "`n[4/4] Ready to start!" -ForegroundColor Yellow
Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    STARTUP INSTRUCTIONS                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Open TWO terminals and run:" -ForegroundColor White
Write-Host "`n📦 Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "   cd `"$projectPath`"" -ForegroundColor Gray
Write-Host "   mvn spring-boot:run" -ForegroundColor White

Write-Host "`n🎨 Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "   cd `"$projectPath\frontend`"" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor White

Write-Host "`n🌐 Access URLs:" -ForegroundColor Yellow
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray

Write-Host "`n✅ All systems ready!" -ForegroundColor Green
Write-Host "`n📚 Documentation: See COMPLETE_READY.md for testing guide`n" -ForegroundColor Cyan
