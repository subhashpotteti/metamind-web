# Update employee PHP files to include sidebar
$employeeFolder = "c:\xampp\htdocs\metaminds\frontend\employee"

$filesToUpdate = @(
    "dashboard.php",
    "attendance.php", 
    "leaves.php",
    "notifications.php",
    "profile.php"
)

$sidebarPattern = '(?s)<aside class="sidebar">.*?</aside>\s*(<main class="main-content">)'
$replacement = '<?php include ''sidebar.php''; ?>`n`n        <main class="main-content">'

foreach ($file in $filesToUpdate) {
    $filePath = Join-Path $employeeFolder $file
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

Write-Host "Employee sidebar update completed!"
