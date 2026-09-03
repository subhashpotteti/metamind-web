# Update admin PHP files to include sidebar
$adminFolder = "c:\xampp\htdocs\metaminds\frontend\admin"

$filesToUpdate = @(
    "dashboard.php",
    "projects.php", 
    "revenue.php",
    "leaves.php",
    "requests.php",
    "employees.php",
    "attendance.php",
    "notifications.php"
)

$sidebarPattern = '(?s)<aside class="sidebar">.*?</aside>\s*(<main class="main-content">)'
$replacement = '<?php include ''sidebar.php''; ?>`n`n        <main class="main-content">'

foreach ($file in $filesToUpdate) {
    $filePath = Join-Path $adminFolder $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        if ($content -match $sidebarPattern) {
            $content = $content -replace $sidebarPattern, $replacement
            Set-Content -Path $filePath -Value $content
            Write-Host "Updated: $file"
        } else {
            Write-Host "Skipped: $file (sidebar pattern not found or already updated)"
        }
    }
}

Write-Host "Admin sidebar update completed!"
