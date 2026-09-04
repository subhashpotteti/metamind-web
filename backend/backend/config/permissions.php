<?php
// Shared server-side authorization. The sidebar is only a convenience; this
// guard is the authority that protects CRUD endpoints.
if (session_status() !== PHP_SESSION_ACTIVE) session_start();

function require_permission(mysqli $conn, string $permission): void {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Please log in first']);
        exit;
    }
    
    // Admin users always have full access
    if (($_SESSION['role'] ?? '') === 'admin') return;
    
    // Check session permissions first for immediate effect
    $sessionPermissions = $_SESSION['permissions'] ?? [];
    if (in_array('*', $sessionPermissions) || in_array($permission, $sessionPermissions)) {
        return;
    }
    
    // Fall back to database check using mapped role_key
    $roleKey = $_SESSION['role_key'] ?? $_SESSION['designation'] ?? '';
    if (empty($roleKey)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'No designation assigned. Please contact admin.']);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT 1 FROM role_permissions WHERE role_key = ? AND permission_key IN ('*', ?) LIMIT 1");
    if (!$stmt) {
        http_response_code(403); echo json_encode(['success' => false, 'message' => 'Permission configuration is unavailable']); exit;
    }
    $stmt->bind_param('ss', $roleKey, $permission);
    $stmt->execute(); $allowed = $stmt->get_result()->num_rows > 0; $stmt->close();
    if (!$allowed) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'You do not have permission for this action']);
        exit;
    }
}

function require_self_or_permission(mysqli $conn, int $employeeId, string $permission): void {
    if (($_SESSION['role'] ?? '') === 'admin') return;
    require_permission($conn, $permission);
    $stmt = $conn->prepare('SELECT id FROM employees WHERE id = ? AND user_id = ? LIMIT 1');
    $userId = (int)($_SESSION['user_id'] ?? 0);
    $stmt->bind_param('ii', $employeeId, $userId); $stmt->execute();
    $owned = $stmt->get_result()->num_rows > 0; $stmt->close();
    if (!$owned) { http_response_code(403); echo json_encode(['success' => false, 'message' => 'You may only access your own records']); exit; }
}

function has_permission(mysqli $conn, string $permission): bool {
    if (empty($_SESSION['user_id'])) return false;
    if (($_SESSION['role'] ?? '') === 'admin') return true;
    
    // Check session permissions first
    $sessionPermissions = $_SESSION['permissions'] ?? [];
    if (in_array('*', $sessionPermissions) || in_array($permission, $sessionPermissions)) {
        return true;
    }
    
    // Fall back to database check using mapped role_key
    $roleKey = $_SESSION['role_key'] ?? $_SESSION['designation'] ?? '';
    if (empty($roleKey)) return false;
    
    $stmt = $conn->prepare("SELECT 1 FROM role_permissions WHERE role_key = ? AND permission_key IN ('*', ?) LIMIT 1");
    if (!$stmt) return false;
    $stmt->bind_param('ss', $roleKey, $permission);
    $stmt->execute();
    $allowed = $stmt->get_result()->num_rows > 0;
    $stmt->close();
    return $allowed;
}

function require_any_permission(mysqli $conn, array $permissions): void {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Please log in first']);
        exit;
    }
    if (($_SESSION['role'] ?? '') === 'admin') return;
    
    // Check session permissions first
    $sessionPermissions = $_SESSION['permissions'] ?? [];
    if (in_array('*', $sessionPermissions)) return;
    foreach ($permissions as $permission) {
        if (in_array($permission, $sessionPermissions)) return;
    }
    
    // Fall back to database check using mapped role_key
    $roleKey = $_SESSION['role_key'] ?? $_SESSION['designation'] ?? '';
    if (empty($roleKey)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'No designation assigned. Please contact admin.']);
        exit;
    }
    
    $placeholders = str_repeat('?,', count($permissions) - 1) . '?';
    $stmt = $conn->prepare("SELECT 1 FROM role_permissions WHERE role_key = ? AND permission_key IN ('*', $placeholders) LIMIT 1");
    if (!$stmt) {
        http_response_code(403); echo json_encode(['success' => false, 'message' => 'Permission configuration is unavailable']); exit;
    }
    $params = array_merge([$roleKey], $permissions);
    $types = str_repeat('s', count($params));
    $stmt->bind_param($types, ...$params);
    $stmt->execute(); $allowed = $stmt->get_result()->num_rows > 0; $stmt->close();
    if (!$allowed) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'You do not have permission for this action']);
        exit;
    }
}

function get_user_permissions(mysqli $conn): array {
    if (empty($_SESSION['user_id'])) return [];
    if (($_SESSION['role'] ?? '') === 'admin') return ['*'];
    
    // Return session permissions if available
    $sessionPermissions = $_SESSION['permissions'] ?? [];
    if (!empty($sessionPermissions)) return $sessionPermissions;
    
    // Fall back to database check using mapped role_key
    $roleKey = $_SESSION['role_key'] ?? $_SESSION['designation'] ?? '';
    if (empty($roleKey)) return [];
    
    $stmt = $conn->prepare("SELECT permission_key FROM role_permissions WHERE role_key = ?");
    if (!$stmt) return [];
    $stmt->bind_param('s', $roleKey);
    $stmt->execute();
    $result = $stmt->get_result();
    $permissions = [];
    while ($row = $result->fetch_assoc()) {
        $permissions[] = $row['permission_key'];
    }
    $stmt->close();
    return $permissions;
}

function check_crud_permission(mysqli $conn, string $resource, string $action): bool {
    $permission = $resource . '.' . $action;
    return has_permission($conn, $permission);
}

function require_crud_permission(mysqli $conn, string $resource, string $action): void {
    $permission = $resource . '.' . $action;
    require_permission($conn, $permission);
}
?>
