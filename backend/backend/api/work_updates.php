<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../config/database.php';
require_once '../config/permissions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Please log in first']);
    exit;
}

// Leadership may read all updates; employees may read only their own updates.
$allowedDesignations = ['ceo', 'manager', 'hr', 'frontend_tl', 'backend_tl'];
$isAdmin = ($_SESSION['role'] ?? '') === 'admin';
$designation = $_SESSION['designation'] ?? $_SESSION['role_key'] ?? '';
if (!$isAdmin && !in_array($designation, $allowedDesignations, true)) require_permission($conn, 'attendance.self');
else require_permission($conn, 'work_updates.read');

$limit = min(max((int)($_GET['limit'] ?? 30), 1), 100);
$where = []; $params = []; $types = '';
if (!empty($_GET['date'])) { $where[] = 'wu.work_date = ?'; $params[] = $_GET['date']; $types .= 's'; }
if (!empty($_GET['employee_id'])) { $where[] = 'wu.employee_id = ?'; $params[] = (int)$_GET['employee_id']; $types .= 'i'; }
if (!$isAdmin && !in_array($designation, $allowedDesignations, true)) {
    $self = $conn->prepare('SELECT id FROM employees WHERE user_id = ? LIMIT 1'); $selfUserId = (int)$_SESSION['user_id']; $self->bind_param('i', $selfUserId); $self->execute();
    $selfEmployeeId = (int)($self->get_result()->fetch_assoc()['id'] ?? 0); $self->close();
    if (!$selfEmployeeId) { http_response_code(403); echo json_encode(['success' => false, 'message' => 'Employee profile not found']); exit; }
    $where[] = 'wu.employee_id = ?'; $params[] = $selfEmployeeId; $types .= 'i';
}
$sql = 'SELECT wu.id, wu.work_update, wu.work_date, wu.created_at, e.full_name, e.employee_code, e.designation, e.department FROM work_updates wu INNER JOIN employees e ON e.id = wu.employee_id' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY wu.work_date DESC, wu.created_at DESC LIMIT ?';
$params[] = $limit; $types .= 'i'; $stmt = $conn->prepare($sql); $stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();
$updates = [];
while ($row = $result->fetch_assoc()) $updates[] = $row;
$stmt->close();

echo json_encode(['success' => true, 'updates' => $updates]);
$conn->close();
