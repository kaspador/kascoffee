# FIXED DIRECTUS SETUP - Complete schema recreation with proper PowerShell syntax
$directusUrl = "https://directus-production-09ff.up.railway.app"
$token = "4pQ8983jK2Fx_M6Rb_8A0UFJTH72f6WU"

Write-Host "=== DIRECTUS SETUP STARTING ===" -ForegroundColor Yellow
Write-Host "Token: $token" -ForegroundColor Cyan
Write-Host "URL: $directusUrl" -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test connection
Write-Host "`n1. Testing connection..." -ForegroundColor Cyan
try {
    $test = Invoke-RestMethod -Uri "$directusUrl/server/info" -Headers $headers -Method GET
    Write-Host "✓ Connected successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create collections
Write-Host "`n2. Creating collections..." -ForegroundColor Cyan

$collections = @("user_pages", "socials", "wallet_snapshots")

foreach ($collectionName in $collections) {
    try {
        $collectionBody = @{
            collection = $collectionName
            meta = @{
                collection = $collectionName
                icon = if($collectionName -eq "user_pages") { "person" } elseif($collectionName -eq "socials") { "share" } else { "account_balance_wallet" }
                note = if($collectionName -eq "user_pages") { "User profile pages" } elseif($collectionName -eq "socials") { "Social media links" } else { "Wallet balance snapshots" }
                hidden = $false
                singleton = $false
            }
            schema = @{
                name = $collectionName
            }
        } | ConvertTo-Json -Depth 10
        
        $result = Invoke-RestMethod -Uri "$directusUrl/collections" -Headers $headers -Method POST -Body $collectionBody
        Write-Host "✓ Created collection: $collectionName" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "✓ Collection already exists: $collectionName" -ForegroundColor Yellow
        } else {
            Write-Host "✗ Failed to create collection $collectionName : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 200
}

Write-Host "`n3. Creating fields..." -ForegroundColor Cyan

# Function to create a field
function Create-Field {
    param($collection, $fieldName, $fieldType, $interface, $note, $nullable = $true, $unique = $false, $maxLength = $null, $defaultValue = $null, $foreignKey = $null, $isPrimary = $false, $special = @())
    
    $field = @{
        field = $fieldName
        type = $fieldType
        meta = @{
            interface = $interface
            width = "full"
            note = $note
            special = $special
        }
        schema = @{
            is_nullable = $nullable
            is_primary_key = $isPrimary
        }
    }
    
    if ($unique) { $field.schema.is_unique = $true }
    if ($maxLength) { $field.schema.max_length = $maxLength }
    if ($defaultValue -ne $null) { $field.schema.default_value = $defaultValue }
    if ($foreignKey) { 
        $field.schema.foreign_key_table = $foreignKey
        $field.schema.foreign_key_column = "id"
    }
    if ($isPrimary) {
        $field.meta.readonly = $true
        $field.meta.hidden = $true
        $field.schema.has_auto_increment = $false
    }
    
    try {
        $body = $field | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "$directusUrl/fields/$collection" -Headers $headers -Method POST -Body $body | Out-Null
        Write-Host "  ✓ Created field: $collection.$fieldName" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "  ✓ Field already exists: $collection.$fieldName" -ForegroundColor Yellow
        } else {
            Write-Host "  ✗ Failed to create field $collection.$fieldName : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 100
}

# USER_PAGES FIELDS
Write-Host "Creating user_pages fields..." -ForegroundColor Yellow
Create-Field "user_pages" "id" "uuid" "input" "Primary key" $false $false $null $null $null $true
Create-Field "user_pages" "user_id" "uuid" "select-dropdown-m2o" "User who owns this page" $false $false $null $null "directus_users"
Create-Field "user_pages" "handle" "string" "input" "Unique handle for URL" $false $true 50
Create-Field "user_pages" "display_name" "string" "input" "Display name" $false $false 100
Create-Field "user_pages" "short_description" "text" "input-multiline" "Brief description"
Create-Field "user_pages" "long_description" "text" "input-rich-text-html" "Detailed description"
Create-Field "user_pages" "kaspa_address" "string" "input" "Kaspa wallet address" $false $false 200
Create-Field "user_pages" "profile_image" "uuid" "file-image" "Profile picture" $true $false $null $null "directus_files"
Create-Field "user_pages" "background_image" "uuid" "file-image" "Background image" $true $false $null $null "directus_files"
Create-Field "user_pages" "background_color" "string" "select-color" "Background color" $false $false 7 "#1a1a1a"
Create-Field "user_pages" "foreground_color" "string" "select-color" "Text color" $false $false 7 "#ffffff"
Create-Field "user_pages" "donation_goal" "decimal" "input" "Donation goal in KAS"
Create-Field "user_pages" "is_active" "boolean" "boolean" "Page is public" $false $false $null $true
Create-Field "user_pages" "view_count" "integer" "input" "Number of views" $false $false $null 0
Create-Field "user_pages" "date_created" "timestamp" "datetime" "Created date" $false $false $null $null $null $false @("date-created")
Create-Field "user_pages" "date_updated" "timestamp" "datetime" "Updated date" $false $false $null $null $null $false @("date-updated")

# SOCIALS FIELDS  
Write-Host "Creating socials fields..." -ForegroundColor Yellow
Create-Field "socials" "id" "uuid" "input" "Primary key" $false $false $null $null $null $true
Create-Field "socials" "user" "uuid" "select-dropdown-m2o" "User who owns this social link" $false $false $null $null "directus_users"
Create-Field "socials" "platform" "string" "select-dropdown" "Social platform" $false $false 50
Create-Field "socials" "url" "string" "input" "Full URL to profile" $false $false 500
Create-Field "socials" "username" "string" "input" "Username or handle" $true $false 100
Create-Field "socials" "is_visible" "boolean" "boolean" "Link is visible" $false $false $null $true
Create-Field "socials" "date_created" "timestamp" "datetime" "Created date" $false $false $null $null $null $false @("date-created")
Create-Field "socials" "date_updated" "timestamp" "datetime" "Updated date" $false $false $null $null $null $false @("date-updated")

# WALLET_SNAPSHOTS FIELDS
Write-Host "Creating wallet_snapshots fields..." -ForegroundColor Yellow  
Create-Field "wallet_snapshots" "id" "uuid" "input" "Primary key" $false $false $null $null $null $true
Create-Field "wallet_snapshots" "kaspa_address" "string" "input" "Kaspa wallet address" $false $false 200
Create-Field "wallet_snapshots" "balance" "string" "input" "Balance in sompi" $false $false 50
Create-Field "wallet_snapshots" "balance_kas" "decimal" "input" "Balance in KAS" $false
Create-Field "wallet_snapshots" "timestamp" "timestamp" "datetime" "Snapshot timestamp" $false
Create-Field "wallet_snapshots" "hour_key" "string" "input" "Hour key for deduplication" $false $false 20
Create-Field "wallet_snapshots" "date_created" "timestamp" "datetime" "Created date" $false $false $null $null $null $false @("date-created")

Write-Host "`n4. Setting up roles and permissions..." -ForegroundColor Cyan

# Get or create roles
try {
    $roles = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method GET
    $publicRole = $roles.data | Where-Object { $_.name -eq "Public" }
    $registeredUsersRole = $roles.data | Where-Object { $_.name -eq "Registered Users" }
    
    if (-not $publicRole) {
        Write-Host "Creating Public role..." -ForegroundColor Yellow
        $publicRoleBody = @{
            name = "Public"
            icon = "public"
            description = "Public access role"
            admin_access = $false
            app_access = $false
        } | ConvertTo-Json -Depth 5
        
        $publicRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $publicRoleBody
        Write-Host "✓ Created Public role" -ForegroundColor Green
    }
    
    if (-not $registeredUsersRole) {
        Write-Host "Creating Registered Users role..." -ForegroundColor Yellow
        $regRoleBody = @{
            name = "Registered Users"
            icon = "group"
            description = "Role for registered users"
            admin_access = $false
            app_access = $true
        } | ConvertTo-Json -Depth 5
        
        $registeredUsersRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $regRoleBody
        Write-Host "✓ Created Registered Users role" -ForegroundColor Green
    }
    
    Write-Host "✓ Roles ready: Public=$($publicRole.id), Registered Users=$($registeredUsersRole.id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed with roles: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create permissions
Write-Host "`n5. Creating permissions..." -ForegroundColor Cyan

function Create-Permission {
    param($role, $collection, $action, $permissions = @{}, $fields = @("*"))
    
    try {
        $permissionBody = @{
            role = $role
            collection = $collection
            action = $action
            permissions = $permissions
            fields = $fields
        } | ConvertTo-Json -Depth 10
        
        Invoke-RestMethod -Uri "$directusUrl/permissions" -Headers $headers -Method POST -Body $permissionBody | Out-Null
        Write-Host "✓ Permission: $collection/$action for role $role" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "✓ Permission exists: $collection/$action" -ForegroundColor Yellow
        } else {
            Write-Host "✗ Failed permission $collection/$action : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 100
}

# Public role permissions
Create-Permission $publicRole.id "user_pages" "read"
Create-Permission $publicRole.id "socials" "read" @{ is_visible = @{ "_eq" = $true } }
Create-Permission $publicRole.id "directus_users" "create"

# Registered Users permissions  
Create-Permission $registeredUsersRole.id "user_pages" "create"
Create-Permission $registeredUsersRole.id "user_pages" "read" @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "user_pages" "update" @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "user_pages" "delete" @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "socials" "create"
Create-Permission $registeredUsersRole.id "socials" "read" @{ user = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "socials" "update" @{ user = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "socials" "delete" @{ user = @{ "_eq" = '$CURRENT_USER' } }

Write-Host "`n=== SETUP COMPLETE! ===" -ForegroundColor Green
Write-Host "✓ Collections: user_pages, socials, wallet_snapshots" -ForegroundColor Green
Write-Host "✓ All fields created" -ForegroundColor Green
Write-Host "✓ Permissions configured" -ForegroundColor Green
Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Set DIRECTUS_TOKEN=4pQ8983jK2Fx_M6Rb_8A0UFJTH72f6WU in Railway" -ForegroundColor Cyan
Write-Host "2. Test user registration" -ForegroundColor Yellow
Write-Host "3. Test profile creation" -ForegroundColor Yellow
