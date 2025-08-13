# SIMPLE DIRECTUS PERMISSIONS SETUP
$directusUrl = "https://directus-production-09ff.up.railway.app"
$token = "XT7BqHxasw4lDoUkwRdZ8TXaJiefFftS"

Write-Host "=== SETTING UP PERMISSIONS ===" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get roles
Write-Host "Getting roles..." -ForegroundColor Cyan
$rolesResponse = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method GET
$roles = $rolesResponse.data

$publicRole = $roles | Where-Object { $_.name -eq "Public" }
$registeredUsersRole = $roles | Where-Object { $_.name -eq "Registered Users" }

Write-Host "Found roles:" -ForegroundColor Green
foreach ($role in $roles) {
    Write-Host "  - $($role.name) (ID: $($role.id))" -ForegroundColor Gray
}

if (-not $publicRole) {
    Write-Host "Creating Public role..." -ForegroundColor Yellow
    $publicRoleData = @{
        name = "Public"
        icon = "public" 
        description = "Public access"
        admin_access = $false
        app_access = $false
    } | ConvertTo-Json -Depth 5
    
    $publicRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $publicRoleData
    $publicRole = $publicRole.data
    Write-Host "Created Public role" -ForegroundColor Green
}

if (-not $registeredUsersRole) {
    Write-Host "Creating Registered Users role..." -ForegroundColor Yellow
    $regRoleData = @{
        name = "Registered Users"
        icon = "group"
        description = "Registered users"
        admin_access = $false
        app_access = $true
    } | ConvertTo-Json -Depth 5
    
    $registeredUsersRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $regRoleData
    $registeredUsersRole = $registeredUsersRole.data
    Write-Host "Created Registered Users role" -ForegroundColor Green
}

Write-Host "`nPublic Role: $($publicRole.id)" -ForegroundColor Cyan
Write-Host "Registered Users Role: $($registeredUsersRole.id)" -ForegroundColor Cyan

# Create permissions
Write-Host "`nCreating permissions..." -ForegroundColor Cyan

$permissions = @(
    # Public permissions
    @{ role = $publicRole.id; collection = "user_pages"; action = "read"; permissions = @{} },
    @{ role = $publicRole.id; collection = "socials"; action = "read"; permissions = @{ is_visible = @{ "_eq" = $true } } },
    @{ role = $publicRole.id; collection = "directus_users"; action = "create"; permissions = @{} },
    
    # Registered Users permissions  
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "create"; permissions = @{} },
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "read"; permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } } },
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "update"; permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } } },
    @{ role = $registeredUsersRole.id; collection = "user_pages"; action = "delete"; permissions = @{ user_id = @{ "_eq" = '$CURRENT_USER' } } },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "create"; permissions = @{} },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "read"; permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } } },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "update"; permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } } },
    @{ role = $registeredUsersRole.id; collection = "socials"; action = "delete"; permissions = @{ user = @{ "_eq" = '$CURRENT_USER' } } }
)

foreach ($perm in $permissions) {
    $permData = @{
        role = $perm.role
        collection = $perm.collection
        action = $perm.action
        permissions = $perm.permissions
        fields = @("*")
    } | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri "$directusUrl/permissions" -Headers $headers -Method POST -Body $permData | Out-Null
        Write-Host "✓ $($perm.collection)/$($perm.action)" -ForegroundColor Green
    } catch {
        Write-Host "✓ $($perm.collection)/$($perm.action) (exists)" -ForegroundColor Yellow
    }
}

Write-Host "`n=== PERMISSIONS COMPLETE ===" -ForegroundColor Green
