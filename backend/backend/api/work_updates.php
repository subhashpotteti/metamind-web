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

// Only leadership and administrators can read colleagues' work updates.
$allowedDesignations = ['ceo', 'manager', 'hr', 'frontend_tl', 'backend_tl'];
$isAdmin = ($_SESSION['role'] ?? '') === 'admin';
$designation = $_SESSION['designation'] ?? $_SESSION['role_key'] ?? '';
if (!$isAdmin && !in_array($designation, $allowedDesignations, true)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Work updates are available to leadership only']);
    exit;
}
require_permission($conn, 'work_updates.read');

$limit = min(max((int)($_GET['limit'] ?? 30), 1), 100);
$stmt = $conn->prepare('SELECT wu.id, wu.work_update, wu.work_date, wu.created_at, e.full_name, e.employee_code, e.designation, e.department FROM work_updates wu INNER JOIN employees e ON e.id = wu.employee_id ORDER BY wu.created_at DESC LIMIT ?');
$stmt->bind_param('i', $limit);
$stmt->execute();
$result = $stmt->get_result();
$updates = [];
while ($row = $result->fetch_assoc()) $updates[] = $row;
$stmt->close();

echo json_encode(['success' => true, 'updates' => $updates]);
$conn->close();
