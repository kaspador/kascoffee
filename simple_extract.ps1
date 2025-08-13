# Simple data extraction using Invoke-WebRequest
$token = "btOkoTF_IsWtlg9vNQT3sqUGgExE0ctt"
$baseUrl = "https://directus-production-09ff.up.railway.app"

Write-Host "Extracting data from Directus..." -ForegroundColor Yellow

# Try to get user_pages data
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/items/user_pages" -Headers @{"Authorization" = "Bearer $token"} -UseBasicParsing
    Write-Host "User Pages Response:" -ForegroundColor Green
    Write-Host $response.Content
    $response.Content | Out-File "user_pages_data.json" -Encoding UTF8
} catch {
    Write-Host "Error getting user_pages: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" -NoNewline

# Try to get socials data
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/items/socials" -Headers @{"Authorization" = "Bearer $token"} -UseBasicParsing
    Write-Host "Socials Response:" -ForegroundColor Green
    Write-Host $response.Content
    $response.Content | Out-File "socials_data.json" -Encoding UTF8
} catch {
    Write-Host "Error getting socials: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" -NoNewline

# Try to get wallet_snapshots data
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/items/wallet_snapshots" -Headers @{"Authorization" = "Bearer $token"} -UseBasicParsing
    Write-Host "Wallet Snapshots Response:" -ForegroundColor Green
    Write-Host $response.Content
    $response.Content | Out-File "wallet_snapshots_data.json" -Encoding UTF8
} catch {
    Write-Host "Error getting wallet_snapshots: $($_.Exception.Message)" -ForegroundColor Red
}


