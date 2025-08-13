# RECREATE SAMPLE DATA SCRIPT
# Run this after the main restoration to recreate your user page

$token = "z73PFWWOqCGlIhJg4JB5U6mmrYDomJF0"
$base = "https://directus-production-09ff.up.railway.app"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "📊 Recreating sample user data..."

# First, get the user ID for kaspador
$userResponse = $null
try {
    $userResponse = Invoke-RestMethod -Uri "$base/users?filter[email][_eq]=kaspador@gmail21.com" -Method GET -Headers $headers
    if ($userResponse.data -and $userResponse.data.Length -gt 0) {
        $userId = $userResponse.data[0].id
        Write-Host "✅ Found user kaspador with ID: $userId"
        
        # Create the user page
        $userPageData = @{
            user_id = $userId
            handle = "kaspador"
            display_name = "kaspador"
            short_description = ""
            long_description = ""
            kaspa_address = "kaspa:qzuyf00lrj6tf2p8cm9n4g5md36qknvvq3h0psvf4p7wuezmcjp67ljcm6zlx"
            profile_image = "https://i.postimg.cc/W1NC8JT6/kw-5zqg8-400x400.jpg"
            background_image = $null
            background_color = "#0f172a"
            foreground_color = "#ffffff"
            donation_goal = 3333
            is_active = $true
            view_count = 0
        } | ConvertTo-Json -Depth 5 -Compress

        try {
            $pageResponse = Invoke-RestMethod -Uri "$base/items/user_pages" -Method POST -Headers $headers -Body $userPageData
            Write-Host "✅ Created user page for kaspador"
        } catch {
            Write-Host "❌ Failed to create user page: $($_.Exception.Message)"
        }
    } else {
        Write-Host "❌ User kaspador not found. You'll need to register again."
    }
} catch {
    Write-Host "❌ Failed to find user: $($_.Exception.Message)"
}

Write-Host "`n🎉 Sample data recreation complete!"
