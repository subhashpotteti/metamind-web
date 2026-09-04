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

// This audit trail must never be visible to employee or intern designations.
$allowedDesignations = ['ceo', 'manager', 'hr', 'frontend_tl', 'backend_tl'];
$isAdmin = ($_SESSION['role'] ?? '') === 'admin';
$designation = $_SESSION['designation'] ?? $_SESSION['role_key'] ?? '';
if (!$isAdmin && !in_array($designation, $allowedDesignations, true)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Attendance logs are available to leadership only']);
    exit;
}
require_permission($conn, 'attendance_logs.read');

$limit = min(max((int)($_GET['limit'] ?? 50), 1), 100);
$stmt = $conn->prepare("SELECT al.id, al.action, al.action_time, al.reason, e.full_name, e.employee_code, e.designation, e.department FROM attendance_logs al INNER JOIN employees e ON e.id = al.employee_id ORDER BY al.action_time DESC, al.id DESC LIMIT ?");
$stmt->bind_param('i', $limit);
$stmt->execute();
$result = $stmt->get_result();
$logs = [];
while ($row = $result->fetch_assoc()) $logs[] = $row;
$stmt->close();

echo json_encode(['success' => true, 'logs' => $logs]);
$conn->close();
