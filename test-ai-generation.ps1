# Test script for AI Question Generation
$baseUrl = "http://localhost:8080"
$topic = "Photosynthesis"
$title = "Plant Biology Quiz"

Write-Host "`n=== Testing AI Question Generation ===" -ForegroundColor Cyan
Write-Host "Topic: $topic" -ForegroundColor Yellow
Write-Host "Title: $title" -ForegroundColor Yellow

$payload = @{
    title = $title
    topic = $topic
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/instructor/tests/generate" -Method Post -Body $payload -ContentType "application/json"
    Write-Host "`n✓ Successfully received response from AI generation endpoint" -ForegroundColor Green
    
    # Check if the response is a JSON string or an object
    if ($response -is [string]) {
        $questions = $response | ConvertFrom-Json
    } else {
        $questions = $response
    }

    Write-Host "Number of questions generated: $($questions.Count)" -ForegroundColor Green
    
    foreach ($q in $questions) {
        Write-Host "`nQ: $($q.question)" -ForegroundColor White
        Write-Host "Options: $($q.options -join ', ')" -ForegroundColor Gray
        Write-Host "Correct Answer: $($q.correctAnswer)" -ForegroundColor DarkGreen
    }

    if ($questions.Count -gt 0) {
        Write-Host "`n✓ AI Question Generation is WORKING!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Received empty questions array." -ForegroundColor Red
    }
} catch {
    Write-Host "`n✗ Error calling AI generation endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}
