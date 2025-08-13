# Try logging in with admin credentials and extracting data
$directusUrl = "https://directus-production-09ff.up.railway.app"

Write-Host "Attempting to login and extract data..." -ForegroundColor Yellow

# Login with admin credentials
$loginBody = @{
    email = "kaspador@gmail.com"
    password = "D@dece123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$directusUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✓ Login successful!" -ForegroundColor Green
    
    $sessionToken = $loginResponse.data.access_token
    $headers = @{"Authorization" = "Bearer $sessionToken"}
    
    # Try to get user_pages with session token
    $userPagesResponse = Invoke-RestMethod -Uri "$directusUrl/items/user_pages" -Headers $headers -Method GET
    Write-Host "User pages found: $($userPagesResponse.data.Count)" -ForegroundColor Cyan
    $userPagesResponse.data | ConvertTo-Json -Depth 10 | Out-File "session_user_pages.json" -Encoding UTF8
    
    # Try to get socials with session token
    $socialsResponse = Invoke-RestMethod -Uri "$directusUrl/items/socials" -Headers $headers -Method GET
    Write-Host "Socials found: $($socialsResponse.data.Count)" -ForegroundColor Cyan
    $socialsResponse.data | ConvertTo-Json -Depth 10 | Out-File "session_socials.json" -Encoding UTF8
    
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please provide the correct admin password" -ForegroundColor Yellow
}
