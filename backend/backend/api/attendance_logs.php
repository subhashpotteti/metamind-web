<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once '../config/database.php';
require_once '../config/permissions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Leadership may view the full audit trail; employees may view only their own logs.
$allowedDesignations = ['ceo', 'manager', 'hr', 'frontend_tl', 'backend_tl'];
$isAdmin = ($_SESSION['role'] ?? '') === 'admin';
$designation = $_SESSION['designation'] ?? $_SESSION['role_key'] ?? '';
if (!$isAdmin && !in_array($designation, $allowedDesignations, true)) require_permission($conn, 'attendance.self');
else require_permission($conn, 'attendance_logs.read');

$limit = min(max((int)($_GET['limit'] ?? 50), 1), 100);
$where = []; $params = []; $types = '';
if (!empty($_GET['from_date'])) { $where[] = 'DATE(al.action_time) >= ?'; $params[] = $_GET['from_date']; $types .= 's'; }
if (!empty($_GET['to_date'])) { $where[] = 'DATE(al.action_time) <= ?'; $params[] = $_GET['to_date']; $types .= 's'; }
if (!empty($_GET['employee_id'])) { $where[] = 'al.employee_id = ?'; $params[] = (int)$_GET['employee_id']; $types .= 'i'; }
if (!$isAdmin && !in_array($designation, $allowedDesignations, true)) {
    $self = $conn->prepare('SELECT id FROM employees WHERE user_id = ? LIMIT 1');
    $selfUserId = (int)$_SESSION['user_id']; $self->bind_param('i', $selfUserId); $self->execute();
    $selfEmployeeId = (int)($self->get_result()->fetch_assoc()['id'] ?? 0); $self->close();
    if (!$selfEmployeeId) { http_response_code(403); echo json_encode(['success' => false, 'message' => 'Employee profile not found']); exit; }
    $where[] = 'al.employee_id = ?'; $params[] = $selfEmployeeId; $types .= 'i';
}
if (!empty($_GET['date'])) { $where[] = 'DATE(al.action_time) = ?'; $params[] = $_GET['date']; $types .= 's'; }
if (!empty($_GET['department'])) { $where[] = 'e.department = ?'; $params[] = $_GET['department']; $types .= 's'; }
if (!empty($_GET['check_in'])) { $where[] = "al.action = 'check_in'"; }
if (!empty($_GET['check_out'])) { $where[] = "al.action = 'check_out'"; }
$sql = "SELECT al.id, al.action, al.action_time, al.reason, e.full_name, e.employee_code, e.designation, e.department FROM attendance_logs al INNER JOIN employees e ON e.id = al.employee_id" . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY al.action_time DESC, al.id DESC LIMIT ?';
$params[] = $limit; $types .= 'i'; $stmt = $conn->prepare($sql); $stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();
$logs = [];
while ($row = $result->fetch_assoc()) $logs[] = $row;
$stmt->close();

echo json_encode(['success' => true, 'logs' => $logs]);
$conn->close();
