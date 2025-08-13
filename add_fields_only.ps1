$token = "NycaHGrACB-vwNisM643XELI-h8MVhE9"
$base = "https://directus-production-09ff.up.railway.app"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "🔧 Adding missing fields to existing collections..."

# USER_PAGES FIELDS
$fields = @(
    @{ field = "user_id"; type = "uuid"; interface = "select-dropdown-m2o"; special = @("m2o"); required = $true; nullable = $false },
    @{ field = "handle"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; unique = $true; max_length = 255 },
    @{ field = "display_name"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 255 },
    @{ field = "short_description"; type = "text"; interface = "input-multiline"; special = $null; required = $false; nullable = $true },
    @{ field = "long_description"; type = "text"; interface = "input-rich-text-html"; special = $null; required = $false; nullable = $true },
    @{ field = "kaspa_address"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 255 },
    @{ field = "profile_image"; type = "string"; interface = "input"; special = $null; required = $false; nullable = $true; max_length = 500 },
    @{ field = "background_image"; type = "string"; interface = "input"; special = $null; required = $false; nullable = $true; max_length = 500 },
    @{ field = "background_color"; type = "string"; interface = "select-color"; special = $null; required = $false; nullable = $true; max_length = 7; default_value = "#0f172a" },
    @{ field = "foreground_color"; type = "string"; interface = "select-color"; special = $null; required = $false; nullable = $true; max_length = 7; default_value = "#ffffff" },
    @{ field = "donation_goal"; type = "integer"; interface = "input"; special = $null; required = $false; nullable = $true },
    @{ field = "is_active"; type = "boolean"; interface = "boolean"; special = $null; required = $false; nullable = $true; default_value = $true },
    @{ field = "view_count"; type = "integer"; interface = "input"; special = $null; required = $false; nullable = $true; default_value = 0 }
)

Write-Host "`nAdding user_pages fields..."
foreach ($fieldConfig in $fields) {
    $schemaConfig = @{
        is_nullable = $fieldConfig.nullable
    }
    
    if ($fieldConfig.unique) { $schemaConfig.is_unique = $true }
    if ($fieldConfig.max_length) { $schemaConfig.max_length = $fieldConfig.max_length }
    if ($fieldConfig.default_value -ne $null) { $schemaConfig.default_value = $fieldConfig.default_value }

    $body = @{
        collection = "user_pages"
        field = $fieldConfig.field
        type = $fieldConfig.type
        meta = @{
            interface = $fieldConfig.interface
            special = $fieldConfig.special
            required = $fieldConfig.required
            options = @{}
        }
        schema = $schemaConfig
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri "$base/fields/user_pages" -Method POST -Headers $headers -Body $body
        Write-Host "✅ user_pages.$($fieldConfig.field)"
    } catch {
        Write-Host "⚠️ user_pages.$($fieldConfig.field) (may already exist)"
    }
}

# SOCIALS FIELDS
$socialFields = @(
    @{ field = "user_id"; type = "uuid"; interface = "select-dropdown-m2o"; special = @("m2o"); required = $true; nullable = $false },
    @{ field = "platform"; type = "string"; interface = "select-dropdown"; special = $null; required = $true; nullable = $false; max_length = 50; choices = @(@{text="Twitter";value="twitter"}, @{text="Discord";value="discord"}, @{text="Telegram";value="telegram"}, @{text="Website";value="website"}, @{text="GitHub";value="github"}) },
    @{ field = "url"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 500 },
    @{ field = "username"; type = "string"; interface = "input"; special = $null; required = $false; nullable = $true; max_length = 255 },
    @{ field = "is_visible"; type = "boolean"; interface = "boolean"; special = $null; required = $false; nullable = $true; default_value = $true }
)

Write-Host "`nAdding socials fields..."
foreach ($fieldConfig in $socialFields) {
    $metaOptions = @{}
    if ($fieldConfig.choices) {
        $metaOptions.choices = $fieldConfig.choices
    }

    $schemaConfig = @{
        is_nullable = $fieldConfig.nullable
    }
    if ($fieldConfig.max_length) { $schemaConfig.max_length = $fieldConfig.max_length }
    if ($fieldConfig.default_value -ne $null) { $schemaConfig.default_value = $fieldConfig.default_value }

    $body = @{
        collection = "socials"
        field = $fieldConfig.field
        type = $fieldConfig.type
        meta = @{
            interface = $fieldConfig.interface
            special = $fieldConfig.special
            required = $fieldConfig.required
            options = $metaOptions
        }
        schema = $schemaConfig
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri "$base/fields/socials" -Method POST -Headers $headers -Body $body
        Write-Host "✅ socials.$($fieldConfig.field)"
    } catch {
        Write-Host "⚠️ socials.$($fieldConfig.field) (may already exist)"
    }
}

# WALLET_SNAPSHOTS FIELDS
$walletFields = @(
    @{ field = "kaspa_address"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 255 },
    @{ field = "balance"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 50 },
    @{ field = "balance_kas"; type = "decimal"; interface = "input"; special = $null; required = $true; nullable = $false; precision = 20; scale = 8 },
    @{ field = "timestamp"; type = "timestamp"; interface = "datetime"; special = $null; required = $true; nullable = $false },
    @{ field = "hour_key"; type = "string"; interface = "input"; special = $null; required = $true; nullable = $false; max_length = 20 }
)

Write-Host "`nAdding wallet_snapshots fields..."
foreach ($fieldConfig in $walletFields) {
    $schemaConfig = @{
        is_nullable = $fieldConfig.nullable
    }
    if ($fieldConfig.max_length) { $schemaConfig.max_length = $fieldConfig.max_length }
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
        }
        schema = $schemaConfig
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri "$base/fields/wallet_snapshots" -Method POST -Headers $headers -Body $body
        Write-Host "✅ wallet_snapshots.$($fieldConfig.field)"
    } catch {
        Write-Host "⚠️ wallet_snapshots.$($fieldConfig.field) (may already exist)"
    }
}

Write-Host "`n🎉 Fields added! Now manually:"
Write-Host "1. Set up user_id relations in Directus admin"
Write-Host "2. Add public read permissions"
Write-Host "3. Add registered user permissions"
