# Convert HTML files to PHP in admin folder
$adminFolder = "c:\xampp\htdocs\metaminds\frontend\admin"
$employeeFolder = "c:\xampp\htdocs\metaminds\frontend\employee"

# Convert admin HTML files (excluding requests.html which is already converted)
Get-ChildItem -Path $adminFolder -Filter "*.html" | Where-Object { $_.Name -ne "requests.html" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '\.html', '.php'
    $newPath = $_.FullName -replace '\.html$', '.php'
    Set-Content -Path $newPath -Value $content
    Write-Host "Converted: $($_.Name) -> $($_.Name -replace '\.html$', '.php')"
}

# Convert employee HTML files (excluding register.html which is already converted)
Get-ChildItem -Path $employeeFolder -Filter "*.html" | Where-Object { $_.Name -ne "register.html" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '\.html', '.php'
    $newPath = $_.FullName -replace '\.html$', '.php'
    Set-Content -Path $newPath -Value $content
    Write-Host "Converted: $($_.Name) -> $($_.Name -replace '\.html$', '.php')"
}

Write-Host "Conversion completed!"
