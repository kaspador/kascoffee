# CREATE DIRECTUS PERMISSIONS
$directusUrl = "https://directus-production-09ff.up.railway.app"
$token = "XT7BqHxasw4lDoUkwRdZ8TXaJiefFftS"

Write-Host "=== CREATING DIRECTUS PERMISSIONS ===" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get existing roles
Write-Host "`nGetting roles..." -ForegroundColor Cyan
try {
    $rolesResponse = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method GET
    $roles = $rolesResponse.data
    
    $publicRole = $roles | Where-Object { $_.name -eq "Public" }
    $registeredUsersRole = $roles | Where-Object { $_.name -eq "Registered Users" }
    
    Write-Host "Found roles:" -ForegroundColor Green
    foreach ($role in $roles) {
        Write-Host "  - $($role.name) (ID: $($role.id))" -ForegroundColor Gray
    }
} catch {
    Write-Host "Error getting roles: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create Public role if it doesn't exist
if (-not $publicRole) {
    Write-Host "`nCreating Public role..." -ForegroundColor Yellow
    try {
        $publicRoleData = @{
            name = "Public"
            icon = "public"
            description = "Public access role for unauthenticated users"
            admin_access = $false
            app_access = $false
        } | ConvertTo-Json -Depth 5
        
        $publicRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $publicRoleData
        Write-Host "✓ Created Public role (ID: $($publicRole.data.id))" -ForegroundColor Green
        $publicRole = $publicRole.data
    } catch {
        Write-Host "Error creating Public role: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create Registered Users role if it doesn't exist
if (-not $registeredUsersRole) {
    Write-Host "`nCreating Registered Users role..." -ForegroundColor Yellow
    try {
        $regUsersRoleData = @{
            name = "Registered Users"
            icon = "group"
            description = "Role for registered users"
            admin_access = $false
            app_access = $true
        } | ConvertTo-Json -Depth 5
        
        $registeredUsersRole = Invoke-RestMethod -Uri "$directusUrl/roles" -Headers $headers -Method POST -Body $regUsersRoleData
        Write-Host "✓ Created Registered Users role (ID: $($registeredUsersRole.data.id))" -ForegroundColor Green
        $registeredUsersRole = $registeredUsersRole.data
    } catch {
        Write-Host "Error creating Registered Users role: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nRoles ready:" -ForegroundColor Cyan
Write-Host "  Public Role ID: $($publicRole.id)" -ForegroundColor Gray
Write-Host "  Registered Users Role ID: $($registeredUsersRole.id)" -ForegroundColor Gray

# Function to create permission
function Create-Permission {
    param($roleId, $collection, $action, $permissions = @{}, $fields = @("*"))
    
    $permissionData = @{
        role = $roleId
        collection = $collection
        action = $action
        permissions = $permissions
        fields = $fields
    } | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri "$directusUrl/permissions" -Headers $headers -Method POST -Body $permissionData | Out-Null
        Write-Host "  ✓ $collection/$action" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*duplicate*") {
            Write-Host "  ✓ $collection/$action (exists)" -ForegroundColor Yellow
        } else {
            Write-Host "  ✗ $collection/$action - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Create Public role permissions
Write-Host "`nCreating Public role permissions..." -ForegroundColor Cyan
Create-Permission $publicRole.id "user_pages" "read"
Create-Permission $publicRole.id "socials" "read" @{ is_visible = @{ "_eq" = $true } }
Create-Permission $publicRole.id "directus_users" "create"

# Create Registered Users permissions
Write-Host "`nCreating Registered Users permissions..." -ForegroundColor Cyan
Create-Permission $registeredUsersRole.id "user_pages" "create"
Create-Permission $registeredUsersRole.id "user_pages" "read" @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "user_pages" "update" @{ user_id = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "user_pages" "delete" @{ user_id = @{ "_eq" = '$CURRENT_USER' } }

Create-Permission $registeredUsersRole.id "socials" "create"
Create-Permission $registeredUsersRole.id "socials" "read" @{ user = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "socials" "update" @{ user = @{ "_eq" = '$CURRENT_USER' } }
Create-Permission $registeredUsersRole.id "socials" "delete" @{ user = @{ "_eq" = '$CURRENT_USER' } }

Write-Host "`n=== PERMISSIONS CREATED ===" -ForegroundColor Green
Write-Host "✓ Public role can read user_pages and visible socials" -ForegroundColor Green
Write-Host "✓ Public role can create new users (registration)" -ForegroundColor Green
Write-Host "✓ Registered Users can manage their own user_pages and socials" -ForegroundColor Green
