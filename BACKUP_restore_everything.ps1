# EMERGENCY BACKUP RESTORATION SCRIPT
# Run this if the Directus deployment fails and you lose everything

$token = "NycaHGrACB-vwNisM643XELI-h8MVhE9"
$base = "https://directus-production-09ff.up.railway.app"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "🚨 EMERGENCY RESTORATION - Creating all collections and fields from scratch..."

# ================================
# STEP 1: CREATE COLLECTIONS
# ================================

Write-Host "`n📋 Creating collections..."

# Create user_pages collection
$body = @{
    collection = "user_pages"
    meta = @{
        collection = "user_pages"
        icon = "person"
        note = "User profile pages"
        display_template = "{{display_name}} (@{{handle}})"
        hidden = $false
        singleton = $false
        translations = $null
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
        preview_url = $null
        versioning = $false
    }
    schema = @{
        name = "user_pages"
    }
} | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "$base/collections" -Method POST -Headers $headers -Body $body
    Write-Host "✅ user_pages collection created"
} catch {
    Write-Host "❌ user_pages collection failed: $($_.Exception.Message)"
}

# Create socials collection
$body = @{
    collection = "socials"
    meta = @{
        collection = "socials"
        icon = "link"
        note = "Social media links"
        display_template = "{{platform}}: {{username}}"
        hidden = $false
        singleton = $false
        translations = $null
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
        preview_url = $null
        versioning = $false
    }
    schema = @{
        name = "socials"
    }
} | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "$base/collections" -Method POST -Headers $headers -Body $body
    Write-Host "✅ socials collection created"
} catch {
    Write-Host "❌ socials collection failed: $($_.Exception.Message)"
}

# Create wallet_snapshots collection
$body = @{
    collection = "wallet_snapshots"
    meta = @{
        collection = "wallet_snapshots"
        icon = "account_balance_wallet"
        note = "Kaspa wallet balance snapshots"
        display_template = "{{kaspa_address}}: {{balance_kas}} KAS"
        hidden = $false
        singleton = $false
        translations = $null
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
        preview_url = $null
        versioning = $false
    }
    schema = @{
        name = "wallet_snapshots"
    }
} | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "$base/collections" -Method POST -Headers $headers -Body $body
    Write-Host "✅ wallet_snapshots collection created"
} catch {
    Write-Host "❌ wallet_snapshots collection failed: $($_.Exception.Message)"
}

# ================================
# STEP 2: CREATE ALL FIELDS
# ================================

Write-Host "`n🔧 Creating user_pages fields..."

# USER_PAGES FIELDS
$fields = @(
    @{ field = "user_id"; type = "uuid"; interface = "select-dropdown-m2o"; special = @("m2o"); required = $true; nullable = $false; note = "Reference to Directus user" },
    @{ field = "handle"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; unique = $true; max_length = 255; note = "Unique username handle" },
    @{ field = "display_name"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 255; note = "Display name" },
    @{ field = "short_description"; type = "text"; interface = "input-multiline"; special = $null; required = $false; nullable = $true; note = "Short bio" },
    @{ field = "long_description"; type = "text"; interface = "input-rich-text-html"; special = $null; required = $false; nullable = $true; note = "Long description" },
    @{ field = "kaspa_address"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 255; note = "Kaspa wallet address" },
    @{ field = "profile_image"; type = "string"; interface = "input"; special = $null; required = $false; nullable = $true; max_length = 500; note = "Profile image URL" },
    @{ field = "background_image"; type = "string"; interface = "input"; special = $null; required = $false; nullable = $true; max_length = 500; note = "Background image URL" },
    @{ field = "background_color"; type = "string"; interface = "select-color"; special = $null; required = $false; nullable = $true; max_length = 7; default_value = "#0f172a"; note = "Background color" },
    @{ field = "foreground_color"; type = "string"; interface = "select-color"; special = $null; required = $false; nullable = $true; max_length = 7; default_value = "#ffffff"; note = "Text color" },
    @{ field = "donation_goal"; type = "integer"; interface = "input"; special = $null; required = $false; nullable = $true; note = "Donation goal in KAS" },
    @{ field = "is_active"; type = "boolean"; interface = "boolean"; special = $null; required = $false; nullable = $true; default_value = $true; note = "Is profile active" },
    @{ field = "view_count"; type = "integer"; interface = "input"; special = $null; required = $false; nullable = $true; default_value = 0; note = "Page view count" }
)

foreach ($fieldConfig in $fields) {
    $body = @{
        collection = "user_pages"
        field = $fieldConfig.field
        type = $fieldConfig.type
        meta = @{
            interface = $fieldConfig.interface
            special = $fieldConfig.special
            required = $fieldConfig.required
            options = @{}
            note = $fieldConfig.note
        }
        schema = @{
            is_nullable = $fieldConfig.nullable
            is_unique = $fieldConfig.unique
            max_length = $fieldConfig.max_length
            default_value = $fieldConfig.default_value
        }
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri "$base/fields/user_pages" -Method POST -Headers $headers -Body $body
        Write-Host "✅ user_pages.$($fieldConfig.field) created"
    } catch {
        Write-Host "❌ user_pages.$($fieldConfig.field) failed: $($_.Exception.Message)"
    }
}

Write-Host "`n🔧 Creating socials fields..."

# SOCIALS FIELDS
$socialFields = @(
    @{ field = "user_id"; type = "uuid"; interface = "select-dropdown-m2o"; special = @("m2o"); required = $true; nullable = $false; note = "Reference to Directus user" },
    @{ field = "platform"; type = "string"; interface = "select-dropdown"; special = $null; required = $true; nullable = $false; max_length = 50; note = "Social platform"; choices = @(@{text="Twitter";value="twitter"}, @{text="Discord";value="discord"}, @{text="Telegram";value="telegram"}, @{text="Website";value="website"}, @{text="GitHub";value="github"}) },
    @{ field = "url"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 500; note = "Social media URL" },
    @{ field = "username"; type = "string"; interface = "input"; special = $null; required = $false; nullable = $true; max_length = 255; note = "Username on platform" },
    @{ field = "is_visible"; type = "boolean"; interface = "boolean"; special = $null; required = $false; nullable = $true; default_value = $true; note = "Is link visible" }
)

foreach ($fieldConfig in $socialFields) {
    $metaOptions = @{}
    if ($fieldConfig.choices) {
        $metaOptions.choices = $fieldConfig.choices
    }

    $body = @{
        collection = "socials"
        field = $fieldConfig.field
        type = $fieldConfig.type
        meta = @{
            interface = $fieldConfig.interface
            special = $fieldConfig.special
            required = $fieldConfig.required
            options = $metaOptions
            note = $fieldConfig.note
        }
        schema = @{
            is_nullable = $fieldConfig.nullable
            max_length = $fieldConfig.max_length
            default_value = $fieldConfig.default_value
        }
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri "$base/fields/socials" -Method POST -Headers $headers -Body $body
        Write-Host "✅ socials.$($fieldConfig.field) created"
    } catch {
        Write-Host "❌ socials.$($fieldConfig.field) failed: $($_.Exception.Message)"
    }
}

Write-Host "`n🔧 Creating wallet_snapshots fields..."

# WALLET_SNAPSHOTS FIELDS
$walletFields = @(
    @{ field = "kaspa_address"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 255; note = "Kaspa wallet address" },
    @{ field = "balance"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 50; note = "Raw balance string" },
    @{ field = "balance_kas"; type = "decimal"; interface = "input"; special = $null; required = $true; nullable = $false; precision = 20; scale = 8; note = "Balance in KAS" },
    @{ field = "timestamp"; type = "timestamp"; interface = "datetime"; special = $null; required = $true; nullable = $false; note = "Snapshot timestamp" },
    @{ field = "hour_key"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 20; note = "Hour key for deduplication" }
)

foreach ($fieldConfig in $walletFields) {
    $schemaConfig = @{
        is_nullable = $fieldConfig.nullable
        max_length = $fieldConfig.max_length
    }
    
    if ($fieldConfig.precision) {
        $schemaConfig.numeric_precision = $fieldConfig.precision
        $schemaConfig.numeric_scale = $fieldConfig.scale
    }

    $body = @{
        collection = "wallet_snapshots"
        field = $fieldConfig.field
        type = $fieldConfig.type
        meta = @{
            interface = $fieldConfig.interface
            special = $fieldConfig.special
            required = $fieldConfig.required
            options = @{}
            note = $fieldConfig.note
        }
        schema = $schemaConfig
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri "$base/fields/wallet_snapshots" -Method POST -Headers $headers -Body $body
        Write-Host "✅ wallet_snapshots.$($fieldConfig.field) created"
    } catch {
        Write-Host "❌ wallet_snapshots.$($fieldConfig.field) failed: $($_.Exception.Message)"
    }
}

# ================================
# STEP 3: CREATE RELATIONS
# ================================

Write-Host "`n🔗 Creating relations..."

# user_pages -> directus_users relation
$body = @{
    many_collection = "user_pages"
    many_field = "user_id"
    one_collection = "directus_users"
    one_field = $null
    one_collection_field = $null
    one_allowed_collections = $null
    junction_field = $null
    sort_field = $null
    one_deselect_action = "nullify"
} | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "$base/relations" -Method POST -Headers $headers -Body $body
    Write-Host "✅ user_pages -> directus_users relation created"
} catch {
    Write-Host "❌ user_pages relation failed: $($_.Exception.Message)"
}

# socials -> directus_users relation
$body = @{
    many_collection = "socials"
    many_field = "user_id"
    one_collection = "directus_users"
    one_field = $null
    one_collection_field = $null
    one_allowed_collections = $null
    junction_field = $null
    sort_field = $null
    one_deselect_action = "nullify"
} | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "$base/relations" -Method POST -Headers $headers -Body $body
    Write-Host "✅ socials -> directus_users relation created"
} catch {
    Write-Host "❌ socials relation failed: $($_.Exception.Message)"
}

# ================================
# STEP 4: CREATE PERMISSIONS
# ================================

Write-Host "`n🔐 Creating permissions..."

# Public role permissions for user_pages
$body = @{
    policy = $null
    collection = "user_pages"
    action = "read"
    permissions = @{}
    validation = $null
    presets = $null
    fields = @("id", "handle", "display_name", "short_description", "long_description", "kaspa_address", "profile_image", "background_image", "background_color", "foreground_color", "donation_goal", "view_count")
} | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "$base/permissions" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Public read permission for user_pages created"
} catch {
    Write-Host "❌ Public user_pages permission failed: $($_.Exception.Message)"
}

# Public role permissions for socials
$body = @{
    policy = $null
    collection = "socials"
    action = "read"
    permissions = @{
        is_visible = @{
            "_eq" = $true
        }
    }
    validation = $null
    presets = $null
    fields = @("id", "platform", "url", "username", "is_visible")
} | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "$base/permissions" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Public read permission for socials created"
} catch {
    Write-Host "❌ Public socials permission failed: $($_.Exception.Message)"
}

Write-Host "`n🎉 EMERGENCY RESTORATION COMPLETE!"
Write-Host "Now manually create Registered Users role permissions in Directus admin:"
Write-Host "- user_pages: Full access with filter {user_id: {`$eq: `$CURRENT_USER}}"
Write-Host "- socials: Full access with filter {user_id: {`$eq: `$CURRENT_USER}}"
