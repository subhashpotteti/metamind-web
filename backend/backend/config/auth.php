<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: ../frontend/admin/login.php');
    exit;
}

// Allow access if user has admin role OR has appropriate permissions
$is_admin = ($_SESSION['role'] ?? '') === 'admin';
$has_full_access = in_array('*', $_SESSION['permissions'] ?? []);

if (!$is_admin && !$has_full_access) {
    // Check if user has specific permission for the current page
    $current_page = basename($_SERVER['PHP_SELF']);
    $permission_map = [
        'dashboard.php' => 'dashboard.view',
        'projects.php' => 'projects.read',
        'revenue.php' => 'revenue.read',
        'leaves.php' => 'leaves.read',
        'requests.php' => 'requests.read',
        'employees.php' => 'employees.read',
        'contacts.php' => 'contacts.read',
        'attendance.php' => 'attendance.read',
        'work-updates.php' => 'work_updates.read',
        'attendance-logs.php' => 'attendance_logs.read',
        'notifications.php' => 'notifications.read',
        'roles.php' => 'roles.manage',
        'notes.php' => 'notes.read',
        'profile.php' => 'profile.self'
    ];
    
    $required_permission = $permission_map[$current_page] ?? null;
    
    if ($required_permission && !in_array($required_permission, $_SESSION['permissions'] ?? [])) {
        header('Location: ../frontend/employee/dashboard.php');
        exit;
    }
}
