# Extract data from Directus using API
$directusUrl = "https://directus-production-09ff.up.railway.app"
$token = "btOkoTF_IsWtlg9vNQT3sqUGgExE0ctt"

Write-Host "Attempting to extract data from Directus..." -ForegroundColor Yellow

# Test authentication first
Write-Host "`nTesting authentication..." -ForegroundColor Cyan
try {
    $authHeaders = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $meResponse = Invoke-RestMethod -Uri "$directusUrl/users/me" -Headers $authHeaders -Method GET
    Write-Host "✓ Authentication successful! Logged in as: $($meResponse.email)" -ForegroundColor Green
} catch {
    Write-Host "✗ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Extract user_pages data
Write-Host "`nExtracting user_pages..." -ForegroundColor Cyan
try {
    $userPagesResponse = Invoke-RestMethod -Uri "$directusUrl/items/user_pages" -Headers $authHeaders -Method GET
    Write-Host "✓ Found $($userPagesResponse.data.Count) user pages:" -ForegroundColor Green
    $userPagesResponse.data | ForEach-Object {
        Write-Host "  - ID: $($_.id), Handle: $($_.handle), Display: $($_.display_name)" -ForegroundColor White
    }
    
    # Save to JSON file
    $userPagesResponse.data | ConvertTo-Json -Depth 10 | Out-File "extracted_user_pages.json" -Encoding UTF8
    Write-Host "✓ Saved to extracted_user_pages.json" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to extract user_pages: $($_.Exception.Message)" -ForegroundColor Red
}

# Extract socials data
Write-Host "`nExtracting socials..." -ForegroundColor Cyan
try {
    $socialsResponse = Invoke-RestMethod -Uri "$directusUrl/items/socials" -Headers $authHeaders -Method GET
    Write-Host "✓ Found $($socialsResponse.data.Count) social records:" -ForegroundColor Green
    $socialsResponse.data | ForEach-Object {
        Write-Host "  - ID: $($_.id), Platform: $($_.platform), User: $($_.user)" -ForegroundColor White
    }
    
    # Save to JSON file
    $socialsResponse.data | ConvertTo-Json -Depth 10 | Out-File "extracted_socials.json" -Encoding UTF8
    Write-Host "✓ Saved to extracted_socials.json" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to extract socials: $($_.Exception.Message)" -ForegroundColor Red
}

# Extract wallet_snapshots data
Write-Host "`nExtracting wallet_snapshots..." -ForegroundColor Cyan
try {
    $walletResponse = Invoke-RestMethod -Uri "$directusUrl/items/wallet_snapshots" -Headers $authHeaders -Method GET
    Write-Host "✓ Found $($walletResponse.data.Count) wallet snapshots:" -ForegroundColor Green
    $walletResponse.data | ForEach-Object {
        Write-Host "  - ID: $($_.id), Address: $($_.kaspa_address), Balance: $($_.balance)" -ForegroundColor White
    }
    
    # Save to JSON file
    $walletResponse.data | ConvertTo-Json -Depth 10 | Out-File "extracted_wallet_snapshots.json" -Encoding UTF8
    Write-Host "✓ Saved to extracted_wallet_snapshots.json" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to extract wallet_snapshots: $($_.Exception.Message)" -ForegroundColor Red
}

# Extract directus_users data (your user accounts)
Write-Host "`nExtracting directus_users..." -ForegroundColor Cyan
try {
    $usersResponse = Invoke-RestMethod -Uri "$directusUrl/users" -Headers $authHeaders -Method GET
    Write-Host "✓ Found $($usersResponse.data.Count) users:" -ForegroundColor Green
    $usersResponse.data | ForEach-Object {
        Write-Host "  - ID: $($_.id), Email: $($_.email), Status: $($_.status)" -ForegroundColor White
    }
    
    # Save to JSON file
    $usersResponse.data | ConvertTo-Json -Depth 10 | Out-File "extracted_users.json" -Encoding UTF8
    Write-Host "✓ Saved to extracted_users.json" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to extract users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nData extraction complete! Check the extracted_*.json files for your data." -ForegroundColor Yellow