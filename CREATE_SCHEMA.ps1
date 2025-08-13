# CREATE DIRECTUS SCHEMA - Simple and Clean
$directusUrl = "https://directus-production-09ff.up.railway.app"
$token = "XT7BqHxasw4lDoUkwRdZ8TXaJiefFftS"

Write-Host "=== CREATING DIRECTUS SCHEMA ===" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test connection
Write-Host "Testing connection..." -ForegroundColor Cyan
try {
    $test = Invoke-RestMethod -Uri "$directusUrl/server/info" -Headers $headers -Method GET
    Write-Host "Connected successfully" -ForegroundColor Green
} catch {
    Write-Host "Connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create collections
Write-Host "`nCreating collections..." -ForegroundColor Cyan
$collections = @("user_pages", "socials", "wallet_snapshots")

foreach ($collection in $collections) {
    $body = @{
        collection = $collection
        meta = @{
            collection = $collection
            hidden = $false
            singleton = $false
        }
        schema = @{
            name = $collection
        }
    } | ConvertTo-Json -Depth 5
    
    try {
        Invoke-RestMethod -Uri "$directusUrl/collections" -Headers $headers -Method POST -Body $body | Out-Null
        Write-Host "Created: $collection" -ForegroundColor Green
    } catch {
        Write-Host "Collection $collection exists or error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Create fields function
function Add-Field($collection, $field, $type, $nullable = $true) {
    $fieldData = @{
        field = $field
        type = $type
        meta = @{
            interface = "input"
            width = "full"
        }
        schema = @{
            is_nullable = $nullable
        }
    }
    
    if ($field -eq "id") {
        $fieldData.schema.is_primary_key = $true
        $fieldData.meta.readonly = $true
        $fieldData.meta.hidden = $true
    }
    
    if ($field -eq "handle") {
        $fieldData.schema.is_unique = $true
        $fieldData.schema.max_length = 50
    }
    
    if ($field -like "*_id" -or $field -eq "user") {
        $fieldData.meta.interface = "select-dropdown-m2o"
        $fieldData.schema.foreign_key_table = "directus_users"
        $fieldData.schema.foreign_key_column = "id"
    }
    
    if ($type -eq "boolean") {
        $fieldData.meta.interface = "boolean"
        $fieldData.schema.default_value = $true
    }
    
    if ($type -eq "integer" -and $field -eq "view_count") {
        $fieldData.schema.default_value = 0
    }
    
    if ($field -like "*color*") {
        $fieldData.meta.interface = "select-color"
        $fieldData.schema.max_length = 7
        if ($field -eq "background_color") {
            $fieldData.schema.default_value = "#1a1a1a"
        } else {
            $fieldData.schema.default_value = "#ffffff"
        }
    }
    
    if ($field -like "*image*") {
        $fieldData.meta.interface = "file-image"
        $fieldData.schema.foreign_key_table = "directus_files"
        $fieldData.schema.foreign_key_column = "id"
    }
    
    if ($field -like "date_*") {
        $fieldData.meta.interface = "datetime"
        $fieldData.meta.readonly = $true
        $fieldData.meta.hidden = $true
        if ($field -eq "date_created") {
            $fieldData.meta.special = @("date-created")
        } else {
            $fieldData.meta.special = @("date-updated")
        }
    }
    
    $body = $fieldData | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri "$directusUrl/fields/$collection" -Headers $headers -Method POST -Body $body | Out-Null
        Write-Host "  Added field: $field" -ForegroundColor Green
    } catch {
        Write-Host "  Field $field exists or error" -ForegroundColor Yellow
    }
}

# USER_PAGES fields
Write-Host "`nCreating user_pages fields..." -ForegroundColor Cyan
Add-Field "user_pages" "id" "uuid" $false
Add-Field "user_pages" "user_id" "uuid" $false
Add-Field "user_pages" "handle" "string" $false
Add-Field "user_pages" "display_name" "string" $false
Add-Field "user_pages" "short_description" "text" $true
Add-Field "user_pages" "long_description" "text" $true
Add-Field "user_pages" "kaspa_address" "string" $false
Add-Field "user_pages" "profile_image" "uuid" $true
Add-Field "user_pages" "background_image" "uuid" $true
Add-Field "user_pages" "background_color" "string" $false
Add-Field "user_pages" "foreground_color" "string" $false
Add-Field "user_pages" "donation_goal" "decimal" $true
Add-Field "user_pages" "is_active" "boolean" $false
Add-Field "user_pages" "view_count" "integer" $false
Add-Field "user_pages" "date_created" "timestamp" $false
Add-Field "user_pages" "date_updated" "timestamp" $false

# SOCIALS fields
Write-Host "`nCreating socials fields..." -ForegroundColor Cyan
Add-Field "socials" "id" "uuid" $false
Add-Field "socials" "user" "uuid" $false
Add-Field "socials" "platform" "string" $false
Add-Field "socials" "url" "string" $false
Add-Field "socials" "username" "string" $true
Add-Field "socials" "is_visible" "boolean" $false
Add-Field "socials" "date_created" "timestamp" $false
Add-Field "socials" "date_updated" "timestamp" $false

# WALLET_SNAPSHOTS fields
Write-Host "`nCreating wallet_snapshots fields..." -ForegroundColor Cyan
Add-Field "wallet_snapshots" "id" "uuid" $false
Add-Field "wallet_snapshots" "kaspa_address" "string" $false
Add-Field "wallet_snapshots" "balance" "string" $false
Add-Field "wallet_snapshots" "balance_kas" "decimal" $false
Add-Field "wallet_snapshots" "timestamp" "timestamp" $false
Add-Field "wallet_snapshots" "hour_key" "string" $false
Add-Field "wallet_snapshots" "date_created" "timestamp" $false

Write-Host "`n=== SCHEMA CREATED ===" -ForegroundColor Green
Write-Host "Next: Set DIRECTUS_TOKEN=XT7BqHxasw4lDoUkwRdZ8TXaJiefFftS in Railway" -ForegroundColor Yellow
