$uri = "http://localhost:8080/api/courses/create-with-videos"
$MultipartContent = [System.Net.Http.MultipartFormDataContent]::new()
$MultipartContent.Add([System.Net.Http.StringContent]::new("Test Course 2026"), "courseTitle")
$MultipartContent.Add([System.Net.Http.StringContent]::new("Description here"), "description")
$MultipartContent.Add([System.Net.Http.StringContent]::new("10"), "classLevel")
$MultipartContent.Add([System.Net.Http.StringContent]::new("Science"), "category")
$MultipartContent.Add([System.Net.Http.StringContent]::new("Published"), "status")
$MultipartContent.Add([System.Net.Http.StringContent]::new("2"), "instructorId")

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $MultipartContent
    echo "SUCCESS: Course created"
    $response | ConvertTo-Json
} catch {
    echo "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $body = $reader.ReadToEnd()
        echo "Response Body: $body"
    }
}
