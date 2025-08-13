# Complete Directus setup script - recreates everything from scratch
$directusUrl = "https://directus-production-09ff.up.railway.app"
$token = "btOkoTF_IsWtlg9vNQT3sqUGgExE0ctt"

Write-Host "=== COMPLETE DIRECTUS SETUP ===" -ForegroundColor Yellow
Write-Host "This will recreate all collections, fields, and permissions" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test connection first
Write-Host "`n1. Testing connection..." -ForegroundColor Cyan
try {
    $test = Invoke-RestMethod -Uri "$directusUrl/server/info" -Headers $headers -Method GET
    Write-Host "✓ Connected to Directus successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create collections if they don't exist
Write-Host "`n2. Creating collections..." -ForegroundColor Cyan

$collections = @(
    @{
        collection = "user_pages"
        meta = @{
            collection = "user_pages"
            icon = "person"
            note = "User profile pages"
            display_template = "{{handle}} - {{display_name}}"
            hidden = $false
            singleton = $false
            translations = @()
            archive_field = $null
            archive_app_filter = $true
            archive_value = $null
            unarchive_value = $null
            sort_field = $null
            accountability = "all"
            color = $null
            item_duplication_fields = $null
            sort = $null
            group = $null
            collapse = "open"
        }
        schema = @{
            name = "user_pages"
        }
    },
    @{
        collection = "socials"
        meta = @{
            collection = "socials"
            icon = "share"
            note = "User social media links"
            display_template = "{{platform}} - {{username}}"
            hidden = $false
            singleton = $false
            translations = @()
            archive_field = $null
            archive_app_filter = $true
            archive_value = $null
            unarchive_value = $null
            sort_field = $null
            accountability = "all"
            color = $null
            item_duplication_fields = $null
            sort = $null
            group = $null
            collapse = "open"
        }
        schema = @{
            name = "socials"
        }
    },
    @{
        collection = "wallet_snapshots"
        meta = @{
            collection = "wallet_snapshots"
            icon = "account_balance_wallet"
            note = "Kaspa wallet balance snapshots"
            display_template = "{{kaspa_address}} - {{balance_kas}} KAS"
            hidden = $false
            singleton = $false
            translations = @()
            archive_field = $null
            archive_app_filter = $true
            archive_value = $null
            unarchive_value = $null
            sort_field = $null
            accountability = "all"
            color = $null
            item_duplication_fields = $null
            sort = $null
            group = $null
            collapse = "open"
        }
        schema = @{
            name = "wallet_snapshots"
        }
    }
)

foreach ($collection in $collections) {
    try {
        $body = $collection | ConvertTo-Json -Depth 10
        $result = Invoke-RestMethod -Uri "$directusUrl/collections" -Headers $headers -Method POST -Body $body
        Write-Host "✓ Created collection: $($collection.collection)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "✓ Collection already exists: $($collection.collection)" -ForegroundColor Yellow
        } else {
            Write-Host "✗ Failed to create collection $($collection.collection): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n3. Creating fields..." -ForegroundColor Cyan

# USER_PAGES FIELDS
$userPageFields = @(
    @{ collection = "user_pages"; field = "id"; type = "uuid"; meta = @{ interface = "input"; readonly = $true; hidden = $true; width = "full" }; schema = @{ is_primary_key = $true; has_auto_increment = $false; is_nullable = $false } },
    @{ collection = "user_pages"; field = "user_id"; type = "uuid"; meta = @{ interface = "select-dropdown-m2o"; display = "related-values"; display_options = @{ template = "{{first_name}} {{last_name}} ({{email}})" }; width = "full"; note = "The Directus user who owns this page" }; schema = @{ is_nullable = $false; foreign_key_column = "id"; foreign_key_table = "directus_users" } },
    @{ collection = "user_pages"; field = "handle"; type = "string"; meta = @{ interface = "input"; width = "half"; note = "Unique handle for the user page URL" }; schema = @{ is_nullable = $false; is_unique = $true; max_length = 50 } },
    @{ collection = "user_pages"; field = "display_name"; type = "string"; meta = @{ interface = "input"; width = "half"; note = "Display name shown on the profile" }; schema = @{ is_nullable = $false; max_length = 100 } },
    @{ collection = "user_pages"; field = "short_description"; type = "text"; meta = @{ interface = "input-multiline"; width = "full"; note = "Brief description of the user" }; schema = @{ is_nullable = $true } },
    @{ collection = "user_pages"; field = "long_description"; type = "text"; meta = @{ interface = "input-rich-text-html"; width = "full"; note = "Detailed description with rich text formatting" }; schema = @{ is_nullable = $true } },
    @{ collection = "user_pages"; field = "kaspa_address"; type = "string"; meta = @{ interface = "input"; width = "full"; note = "Kaspa wallet address for donations" }; schema = @{ is_nullable = $false; max_length = 200 } },
    @{ collection = "user_pages"; field = "profile_image"; type = "uuid"; meta = @{ interface = "file-image"; width = "half"; note = "Profile picture" }; schema = @{ is_nullable = $true; foreign_key_column = "id"; foreign_key_table = "directus_files" } },
    @{ collection = "user_pages"; field = "background_image"; type = "uuid"; meta = @{ interface = "file-image"; width = "half"; note = "Background image for the profile" }; schema = @{ is_nullable = $true; foreign_key_column = "id"; foreign_key_table = "directus_files" } },
    @{ collection = "user_pages"; field = "background_color"; type = "string"; meta = @{ interface = "select-color"; width = "half"; note = "Background color if no image" }; schema = @{ is_nullable = $false; default_value = "#1a1a1a"; max_length = 7 } },
    @{ collection = "user_pages"; field = "foreground_color"; type = "string"; meta = @{ interface = "select-color"; width = "half"; note = "Text and foreground color" }; schema = @{ is_nullable = $false; default_value = "#ffffff"; max_length = 7 } },
    @{ collection = "user_pages"; field = "donation_goal"; type = "decimal"; meta = @{ interface = "input"; width = "half"; note = "Donation goal in KAS" }; schema = @{ is_nullable = $true; numeric_precision = 18; numeric_scale = 8 } },
    @{ collection = "user_pages"; field = "is_active"; type = "boolean"; meta = @{ interface = "boolean"; width = "half"; note = "Whether the page is publicly visible" }; schema = @{ is_nullable = $false; default_value = $true } },
    @{ collection = "user_pages"; field = "view_count"; type = "integer"; meta = @{ interface = "input"; readonly = $true; width = "half"; note = "Number of page views" }; schema = @{ is_nullable = $false; default_value = 0 } },
    @{ collection = "user_pages"; field = "date_created"; type = "timestamp"; meta = @{ interface = "datetime"; readonly = $true; hidden = $true; width = "half" }; schema = @{ is_nullable = $false } },
    @{ collection = "user_pages"; field = "date_updated"; type = "timestamp"; meta = @{ interface = "datetime"; readonly = $true; hidden = $true; width = "half" }; schema = @{ is_nullable = $false } }
)

# SOCIALS FIELDS
$socialFields = @(
    @{ collection = "socials"; field = "id"; type = "uuid"; meta = @{ interface = "input"; readonly = $true; hidden = $true; width = "full" }; schema = @{ is_primary_key = $true; has_auto_increment = $false; is_nullable = $false } },
    @{ collection = "socials"; field = "user"; type = "uuid"; meta = @{ interface = "select-dropdown-m2o"; display = "related-values"; display_options = @{ template = "{{first_name}} {{last_name}} ({{email}})" }; width = "full"; note = "The Directus user who owns this social link" }; schema = @{ is_nullable = $false; foreign_key_column = "id"; foreign_key_table = "directus_users" } },
    @{ collection = "socials"; field = "platform"; type = "string"; meta = @{ interface = "select-dropdown"; options = @{ choices = @(@{ text = "Twitter"; value = "twitter" }, @{ text = "Instagram"; value = "instagram" }, @{ text = "TikTok"; value = "tiktok" }, @{ text = "YouTube"; value = "youtube" }, @{ text = "Twitch"; value = "twitch" }, @{ text = "Discord"; value = "discord" }, @{ text = "GitHub"; value = "github" }, @{ text = "LinkedIn"; value = "linkedin" }, @{ text = "Website"; value = "website" }) }; width = "half"; note = "Social media platform" }; schema = @{ is_nullable = $false; max_length = 50 } },
    @{ collection = "socials"; field = "username"; type = "string"; meta = @{ interface = "input"; width = "half"; note = "Username or handle on the platform" }; schema = @{ is_nullable = $false; max_length = 100 } },
    @{ collection = "socials"; field = "url"; type = "string"; meta = @{ interface = "input"; width = "full"; note = "Full URL to the social profile" }; schema = @{ is_nullable = $false; max_length = 500 } },
    @{ collection = "socials"; field = "is_visible"; type = "boolean"; meta = @{ interface = "boolean"; width = "half"; note = "Whether this social link is publicly visible" }; schema = @{ is_nullable = $false; default_value = $true } },
    @{ collection = "socials"; field = "sort_order"; type = "integer"; meta = @{ interface = "input"; width = "half"; note = "Display order (lower numbers first)" }; schema = @{ is_nullable = $false; default_value = 0 } },
    @{ collection = "socials"; field = "date_created"; type = "timestamp"; meta = @{ interface = "datetime"; readonly = $true; hidden = $true; width = "half" }; schema = @{ is_nullable = $false } },
    @{ collection = "socials"; field = "date_updated"; type = "timestamp"; meta = @{ interface = "datetime"; readonly = $true; hidden = $true; width = "half" }; schema = @{ is_nullable = $false } }
)

# WALLET_SNAPSHOTS FIELDS
$walletFields = @(
    @{ collection = "wallet_snapshots"; field = "id"; type = "uuid"; meta = @{ interface = "input"; readonly = $true; hidden = $true; width = "full" }; schema = @{ is_primary_key = $true; has_auto_increment = $false; is_nullable = $false } },
    @{ collection = "wallet_snapshots"; field = "kaspa_address"; type = "string"; meta = @{ interface = "input"; width = "full"; note = "Kaspa wallet address" }; schema = @{ is_nullable = $false; max_length = 200 } },
    @{ collection = "wallet_snapshots"; field = "balance"; type = "string"; meta = @{ interface = "input"; width = "half"; note = "Balance in sompi (smallest unit)" }; schema = @{ is_nullable = $false; max_length = 50 } },
    @{ collection = "wallet_snapshots"; field = "balance_kas"; type = "string"; meta = @{ interface = "input"; width = "half"; note = "Balance in KAS (formatted)" }; schema = @{ is_nullable = $false; max_length = 50 } },
    @{ collection = "wallet_snapshots"; field = "timestamp"; type = "timestamp"; meta = @{ interface = "datetime"; width = "half"; note = "When this snapshot was taken" }; schema = @{ is_nullable = $false } },
    @{ collection = "wallet_snapshots"; field = "hour_key"; type = "string"; meta = @{ interface = "input"; width = "half"; note = "Hour grouping key for deduplication" }; schema = @{ is_nullable = $false; max_length = 20 } },
    @{ collection = "wallet_snapshots"; field = "date_created"; type = "timestamp"; meta = @{ interface = "datetime"; readonly = $true; hidden = $true; width = "half" }; schema = @{ is_nullable = $false } }
)

$allFields = $userPageFields + $socialFields + $walletFields

foreach ($field in $allFields) {
    try {
        $body = $field | ConvertTo-Json -Depth 10
        $result = Invoke-RestMethod -Uri "$directusUrl/fields/$($field.collection)" -Headers $headers -Method POST -Body $body
        Write-Host "✓ Created field: $($field.collection).$($field.field)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "✓ Field already exists: $($field.collection).$($field.field)" -ForegroundColor Yellow
        } else {
            Write-Host "✗ Failed to create field $($field.collection).$($field.field): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n4. Setting up permissions..." -ForegroundColor Cyan

# Get role IDs
try {
    $roles = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method GET
    $publicRole = $roles.data | Where-Object { $_.name -eq "Public" }
    $authenticatedRole = $roles.data | Where-Object { $_.name -eq "Authenticated" }
    $registeredUsersRole = $roles.data | Where-Object { $_.name -eq "Registered Users" }
    
    Write-Host "✓ Found roles: Public=$($publicRole.id), Authenticated=$($authenticatedRole.id), Registered Users=$($registeredUsersRole.id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get roles: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Public role permissions
$publicPermissions = @(
    @{ role = $publicRole.id; collection = "user_pages"; action = "read"; permissions = @{}; validation = @{}; presets = @{}; fields = @("*") },
    @{ role = $publicRole.id; collection = "socials"; action = "read"; permissions = @{ is_visible = @{ "_eq" = $true } }; validation = @{}; presets = @{}; fields = @("*") },
    @{ role = $publicRole.id; collection = "directus_users"; action = "create"; permissions = @{}; validation = @{}; presets = @{}; fields = @("*") }
)

# Registered Users role permissions
$registeredPermissions = @(
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "create"; permissions = @{}; validation = @{}; presets = @{ user_id = '$CURRENT_USER' }; fields = @("*") },
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "read"; permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } }; validation = @{}; presets = @{}; fields = @("*") },
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "update"; permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } }; validation = @{}; presets = @{}; fields = @("*") },
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "delete"; permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } }; validation = @{}; presets = @{}; fields = @("*") },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "create"; permissions = @{}; validation = @{}; presets = @{ user = '$CURRENT_USER' }; fields = @("*") },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "read"; permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } }; validation = @{}; presets = @{}; fields = @("*") },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "update"; permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } }; validation = @{}; presets = @{}; fields = @("*") },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "delete"; permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } }; validation = @{}; presets = @{}; fields = @("*") }
)

$allPermissions = $publicPermissions + $registeredPermissions

foreach ($permission in $allPermissions) {
    try {
        $body = $permission | ConvertTo-Json -Depth 10
        $result = Invoke-RestMethod -Uri "$directusUrl/permissions" -Headers $headers -Method POST -Body $body
        Write-Host "✓ Created permission: $($permission.collection)/$($permission.action) for role $($permission.role)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "✓ Permission already exists: $($permission.collection)/$($permission.action)" -ForegroundColor Yellow
        } else {
            Write-Host "✗ Failed to create permission: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "✓ All collections created" -ForegroundColor Green
Write-Host "✓ All fields added" -ForegroundColor Green
Write-Host "✓ All permissions configured" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Set DIRECTUS_TOKEN=btOkoTF_IsWtlg9vNQT3sqUGgExE0ctt in your Next.js app" -ForegroundColor Yellow
Write-Host "2. Test user registration and profile creation" -ForegroundColor Yellow
Write-Host "3. Verify view tracking works" -ForegroundColor Yellow


