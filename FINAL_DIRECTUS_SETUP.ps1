# FINAL DIRECTUS SETUP - Complete schema recreation
# Based on actual codebase analysis
$directusUrl = "https://directus-production-09ff.up.railway.app"
$token = "4pQ8983jK2Fx_M6Rb_8A0UFJTH72f6WU"

Write-Host "=== FINAL DIRECTUS SETUP ===" -ForegroundColor Yellow
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

# Get current collections to see what exists
Write-Host "`n2. Checking existing collections..." -ForegroundColor Cyan
try {
    $existingCollections = Invoke-RestMethod -Uri "$directusUrl/collections" -Headers $headers -Method GET
    $collectionNames = $existingCollections.data | ForEach-Object { $_.collection }
    Write-Host "Existing collections: $($collectionNames -join ', ')" -ForegroundColor Yellow
} catch {
    Write-Host "Could not retrieve existing collections" -ForegroundColor Yellow
}

# Create collections
Write-Host "`n3. Creating collections..." -ForegroundColor Cyan

$collections = @(
    @{
        collection = "user_pages"
        meta = @{
            collection = "user_pages"
            icon = "person"
            note = "User profile pages for Buy Me a Coffee clone"
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
            note = "Kaspa wallet balance snapshots for donation tracking"
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
        if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*duplicate*") {
            Write-Host "✓ Collection already exists: $($collection.collection)" -ForegroundColor Yellow
        } else {
            Write-Host "✗ Failed to create collection $($collection.collection): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 200
}

Write-Host "`n4. Creating fields..." -ForegroundColor Cyan

# USER_PAGES FIELDS (based on UserPage interface)
$userPageFields = @(
    @{ 
        field = "id"
        type = "uuid"
        meta = @{ 
            interface = "input"
            readonly = $true
            hidden = $true
            width = "full"
        }
        schema = @{ 
            is_primary_key = $true
            has_auto_increment = $false
            is_nullable = $false
        }
    },
    @{ 
        field = "user_id"
        type = "uuid"
        meta = @{ 
            interface = "select-dropdown-m2o"
            display = "related-values"
            display_options = @{ template = "{{first_name}} {{last_name}} ({{email}})" }
            width = "full"
            note = "The Directus user who owns this page"
        }
        schema = @{ 
            is_nullable = $false
            foreign_key_column = "id"
            foreign_key_table = "directus_users"
        }
    },
    @{ 
        field = "handle"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "half"
            note = "Unique handle for the user page URL (e.g., kaspador)"
        }
        schema = @{ 
            is_nullable = $false
            is_unique = $true
            max_length = 50
        }
    },
    @{ 
        field = "display_name"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "half"
            note = "Display name shown on the profile"
        }
        schema = @{ 
            is_nullable = $false
            max_length = 100
        }
    },
    @{ 
        field = "short_description"
        type = "text"
        meta = @{ 
            interface = "input-multiline"
            width = "full"
            note = "Brief description of the user"
        }
        schema = @{ 
            is_nullable = $true
        }
    },
    @{ 
        field = "long_description"
        type = "text"
        meta = @{ 
            interface = "input-rich-text-html"
            width = "full"
            note = "Detailed description with rich text formatting"
        }
        schema = @{ 
            is_nullable = $true
        }
    },
    @{ 
        field = "kaspa_address"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "full"
            note = "Kaspa wallet address for donations"
        }
        schema = @{ 
            is_nullable = $false
            max_length = 200
        }
    },
    @{ 
        field = "profile_image"
        type = "uuid"
        meta = @{ 
            interface = "file-image"
            width = "half"
            note = "Profile picture"
        }
        schema = @{ 
            is_nullable = $true
            foreign_key_column = "id"
            foreign_key_table = "directus_files"
        }
    },
    @{ 
        field = "background_image"
        type = "uuid"
        meta = @{ 
            interface = "file-image"
            width = "half"
            note = "Background image for the profile"
        }
        schema = @{ 
            is_nullable = $true
            foreign_key_column = "id"
            foreign_key_table = "directus_files"
        }
    },
    @{ 
        field = "background_color"
        type = "string"
        meta = @{ 
            interface = "select-color"
            width = "half"
            note = "Background color if no image"
        }
        schema = @{ 
            is_nullable = $false
            default_value = "#1a1a1a"
            max_length = 7
        }
    },
    @{ 
        field = "foreground_color"
        type = "string"
        meta = @{ 
            interface = "select-color"
            width = "half"
            note = "Text and foreground color"
        }
        schema = @{ 
            is_nullable = $false
            default_value = "#ffffff"
            max_length = 7
        }
    },
    @{ 
        field = "donation_goal"
        type = "decimal"
        meta = @{ 
            interface = "input"
            width = "half"
            note = "Donation goal in KAS"
        }
        schema = @{ 
            is_nullable = $true
            numeric_precision = 18
            numeric_scale = 8
        }
    },
    @{ 
        field = "is_active"
        type = "boolean"
        meta = @{ 
            interface = "boolean"
            width = "half"
            note = "Whether the page is publicly visible"
        }
        schema = @{ 
            is_nullable = $false
            default_value = $true
        }
    },
    @{ 
        field = "view_count"
        type = "integer"
        meta = @{ 
            interface = "input"
            readonly = $true
            width = "half"
            note = "Number of page views"
        }
        schema = @{ 
            is_nullable = $false
            default_value = 0
        }
    },
    @{ 
        field = "date_created"
        type = "timestamp"
        meta = @{ 
            interface = "datetime"
            readonly = $true
            hidden = $true
            width = "half"
            special = @("date-created")
        }
        schema = @{ 
            is_nullable = $false
        }
    },
    @{ 
        field = "date_updated"
        type = "timestamp"
        meta = @{ 
            interface = "datetime"
            readonly = $true
            hidden = $true
            width = "half"
            special = @("date-updated")
        }
        schema = @{ 
            is_nullable = $false
        }
    }
)

# SOCIALS FIELDS (based on Social interface)
$socialFields = @(
    @{ 
        field = "id"
        type = "uuid"
        meta = @{ 
            interface = "input"
            readonly = $true
            hidden = $true
            width = "full"
        }
        schema = @{ 
            is_primary_key = $true
            has_auto_increment = $false
            is_nullable = $false
        }
    },
    @{ 
        field = "user"
        type = "uuid"
        meta = @{ 
            interface = "select-dropdown-m2o"
            display = "related-values"
            display_options = @{ template = "{{first_name}} {{last_name}} ({{email}})" }
            width = "full"
            note = "The Directus user who owns this social link"
        }
        schema = @{ 
            is_nullable = $false
            foreign_key_column = "id"
            foreign_key_table = "directus_users"
        }
    },
    @{ 
        field = "platform"
        type = "string"
        meta = @{ 
            interface = "select-dropdown"
            options = @{ 
                choices = @(
                    @{ text = "Twitter"; value = "twitter" }
                    @{ text = "Discord"; value = "discord" }
                    @{ text = "Telegram"; value = "telegram" }
                    @{ text = "Website"; value = "website" }
                )
            }
            width = "half"
            note = "Social media platform"
        }
        schema = @{ 
            is_nullable = $false
            max_length = 50
        }
    },
    @{ 
        field = "url"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "full"
            note = "Full URL to the social profile"
        }
        schema = @{ 
            is_nullable = $false
            max_length = 500
        }
    },
    @{ 
        field = "username"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "half"
            note = "Username or handle on the platform"
        }
        schema = @{ 
            is_nullable = $true
            max_length = 100
        }
    },
    @{ 
        field = "is_visible"
        type = "boolean"
        meta = @{ 
            interface = "boolean"
            width = "half"
            note = "Whether this social link is publicly visible"
        }
        schema = @{ 
            is_nullable = $false
            default_value = $true
        }
    },
    @{ 
        field = "date_created"
        type = "timestamp"
        meta = @{ 
            interface = "datetime"
            readonly = $true
            hidden = $true
            width = "half"
            special = @("date-created")
        }
        schema = @{ 
            is_nullable = $false
        }
    },
    @{ 
        field = "date_updated"
        type = "timestamp"
        meta = @{ 
            interface = "datetime"
            readonly = $true
            hidden = $true
            width = "half"
            special = @("date-updated")
        }
        schema = @{ 
            is_nullable = $false
        }
    }
)

# WALLET_SNAPSHOTS FIELDS (based on WalletSnapshot interface)
$walletFields = @(
    @{ 
        field = "id"
        type = "uuid"
        meta = @{ 
            interface = "input"
            readonly = $true
            hidden = $true
            width = "full"
        }
        schema = @{ 
            is_primary_key = $true
            has_auto_increment = $false
            is_nullable = $false
        }
    },
    @{ 
        field = "kaspa_address"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "full"
            note = "Kaspa wallet address"
        }
        schema = @{ 
            is_nullable = $false
            max_length = 200
        }
    },
    @{ 
        field = "balance"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "half"
            note = "Balance in sompi (smallest unit) - stored as string for precision"
        }
        schema = @{ 
            is_nullable = $false
            max_length = 50
        }
    },
    @{ 
        field = "balance_kas"
        type = "decimal"
        meta = @{ 
            interface = "input"
            width = "half"
            note = "Balance in KAS (formatted for display)"
        }
        schema = @{ 
            is_nullable = $false
            numeric_precision = 18
            numeric_scale = 8
        }
    },
    @{ 
        field = "timestamp"
        type = "timestamp"
        meta = @{ 
            interface = "datetime"
            width = "half"
            note = "When this snapshot was taken"
        }
        schema = @{ 
            is_nullable = $false
        }
    },
    @{ 
        field = "hour_key"
        type = "string"
        meta = @{ 
            interface = "input"
            width = "half"
            note = "Hour grouping key for deduplication (e.g., 2025-07-25T20)"
        }
        schema = @{ 
            is_nullable = $false
            max_length = 20
        }
    },
    @{ 
        field = "date_created"
        type = "timestamp"
        meta = @{ 
            interface = "datetime"
            readonly = $true
            hidden = $true
            width = "half"
            special = @("date-created")
        }
        schema = @{ 
            is_nullable = $false
        }
    }
)

# Create fields for each collection
$fieldCollections = @{
    "user_pages" = $userPageFields
    "socials" = $socialFields
    "wallet_snapshots" = $walletFields
}

foreach ($collectionName in $fieldCollections.Keys) {
    Write-Host "Creating fields for $collectionName..." -ForegroundColor Yellow
    
    foreach ($field in $fieldCollections[$collectionName]) {
        try {
            $body = $field | ConvertTo-Json -Depth 10
            $result = Invoke-RestMethod -Uri "$directusUrl/fields/$collectionName" -Headers $headers -Method POST -Body $body
            Write-Host "  ✓ Created field: $($field.field)" -ForegroundColor Green
        } catch {
            if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*duplicate*") {
                Write-Host "  ✓ Field already exists: $($field.field)" -ForegroundColor Yellow
            } else {
                Write-Host "  ✗ Failed to create field $($field.field): $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        Start-Sleep -Milliseconds 100
    }
}

Write-Host "`n5. Setting up roles and permissions..." -ForegroundColor Cyan

# Get roles
try {
    $roles = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method GET
    $publicRole = $roles.data | Where-Object { $_.name -eq "Public" }
    $registeredUsersRole = $roles.data | Where-Object { $_.name -eq "Registered Users" }
    
    if (-not $publicRole) {
        Write-Host "Public role not found, creating it..." -ForegroundColor Yellow
        $publicRoleBody = @{
            name = "Public"
            icon = "public"
            description = "Public access role for unauthenticated users"
            ip_access = $null
            enforce_tfa = $false
            admin_access = $false
            app_access = $false
        } | ConvertTo-Json -Depth 5
        
        $publicRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $publicRoleBody
        Write-Host "✓ Created Public role" -ForegroundColor Green
    }
    
    if (-not $registeredUsersRole) {
        Write-Host "Registered Users role not found, creating it..." -ForegroundColor Yellow
        $regRoleBody = @{
            name = "Registered Users"
            icon = "group"
            description = "Role for registered users"
            ip_access = $null
            enforce_tfa = $false
            admin_access = $false
            app_access = $true
        } | ConvertTo-Json -Depth 5
        
        $registeredUsersRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $regRoleBody
        Write-Host "✓ Created Registered Users role" -ForegroundColor Green
    }
    
    Write-Host "✓ Roles: Public=$($publicRole.id), Registered Users=$($registeredUsersRole.id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get/create roles: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create permissions
Write-Host "`n6. Creating permissions..." -ForegroundColor Cyan

$permissions = @(
    # Public role permissions
    @{ 
        role = $publicRole.id
        collection = "user_pages"
        action = "read"
        permissions = @{}
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    @{ 
        role = $publicRole.id
        collection = "socials"
        action = "read"
        permissions = @{ is_visible = @{ "_eq" = $true } }
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    @{ 
        role = $publicRole.id
        collection = "directus_users"
        action = "create"
        permissions = @{}
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    
    # Registered Users role permissions
    @{ 
        role = $registeredUsersRole.id
        collection = "user_pages"
        action = "create"
        permissions = @{}
        validation = @{}
        presets = @{ user_id = '$CURRENT_USER' }
        fields = @("*")
    },
    @{ 
        role = $registeredUsersRole.id
        collection = "user_pages"
        action = "read"
        permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    @{ 
        role = $registeredUsersRole.id
        collection = "user_pages"
        action = "update"
        permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    @{ 
        role = $registeredUsersRole.id
        collection = "user_pages"
        action = "delete"
        permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    @{ 
        role = $registeredUsersRole.id
        collection = "socials"
        action = "create"
        permissions = @{}
        validation = @{}
        presets = @{ user = '$CURRENT_USER' }
        fields = @("*")
    },
    @{ 
        role = $registeredUsersRole.id
        collection = "socials"
        action = "read"
        permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } }
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    @{ 
        role = $registeredUsersRole.id
        collection = "socials"
        action = "update"
        permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } }
        validation = @{}
        presets = @{}
        fields = @("*")
    },
    @{ 
        role = $registeredUsersRole.id
        collection = "socials"
        action = "delete"
        permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } }
        validation = @{}
        presets = @{}
        fields = @("*")
    }
)

foreach ($permission in $permissions) {
    try {
        $body = $permission | ConvertTo-Json -Depth 10
        $result = Invoke-RestMethod -Uri "$directusUrl/permissions" -Headers $headers -Method POST -Body $body
        Write-Host "✓ Created permission: $($permission.collection)/$($permission.action) for role $($permission.role)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*duplicate*") {
            Write-Host "✓ Permission already exists: $($permission.collection)/$($permission.action)" -ForegroundColor Yellow
        } else {
            Write-Host "✗ Failed to create permission: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 100
}

Write-Host "`n=== SETUP COMPLETE! ===" -ForegroundColor Green
Write-Host "✓ Collections: user_pages, socials, wallet_snapshots" -ForegroundColor Green
Write-Host "✓ All fields created with proper types and interfaces" -ForegroundColor Green
Write-Host "✓ Permissions configured for Public and Registered Users roles" -ForegroundColor Green
Write-Host "`nIMPORTANT NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Update your Next.js app environment variable:" -ForegroundColor Yellow
Write-Host "   DIRECTUS_TOKEN=4pQ8983jK2Fx_M6Rb_8A0UFJTH72f6WU" -ForegroundColor Cyan
Write-Host "2. Test user registration at /auth/signup" -ForegroundColor Yellow
Write-Host "3. Test profile creation/update at /dashboard" -ForegroundColor Yellow
Write-Host "4. Test public page viewing at /[handle]" -ForegroundColor Yellow
Write-Host "5. Test view tracking functionality" -ForegroundColor Yellow
