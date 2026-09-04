<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../config/permissions.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    if (in_array($action, ['get_today_attendance', 'get_attendance_history', 'get_dashboard_overview'], true)) require_self_or_permission($conn, (int)($_GET['employee_id'] ?? 0), 'attendance.self');
    if (in_array($action, ['get_employee_leaves', 'get_leave_balance'], true)) require_self_or_permission($conn, (int)($_GET['employee_id'] ?? 0), 'leaves.self');
    if (in_array($action, ['get_employee_notes'], true)) require_self_or_permission($conn, (int)($_GET['employee_id'] ?? 0), 'notes.self');
    if (in_array($action, ['get_employee_notifications'], true)) require_self_or_permission($conn, (int)($_GET['employee_id'] ?? 0), 'notifications.self');
    
    if ($action === 'get_today_attendance') {
        $employee_id = $_GET['employee_id'] ?? '';
        $date = $_GET['date'] ?? date('Y-m-d');
        
        $stmt = $conn->prepare("SELECT *, COALESCE((SELECT SUM(total_hours) FROM attendance WHERE employee_id = ? AND date = ?), 0) AS day_total_hours FROM attendance WHERE employee_id = ? AND date = ? ORDER BY check_in_time DESC, id DESC LIMIT 1");
        $stmt->bind_param("isis", $employee_id, $date, $employee_id, $date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $attendance = $result->fetch_assoc();
            echo json_encode(['success' => true, 'attendance' => $attendance]);
        } else {
            echo json_encode(['success' => true, 'attendance' => null]);
        }
        $stmt->close();
        
    } elseif ($action === 'get_attendance_history') {
        $employee_id = $_GET['employee_id'] ?? '';
        $month = $_GET['month'] ?? date('Y-m');
        
        $stmt = $conn->prepare("SELECT * FROM attendance WHERE employee_id = ? AND DATE_FORMAT(date, '%Y-%m') = ? ORDER BY date DESC");
        $stmt->bind_param("is", $employee_id, $month);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $attendance = [];
        while ($row = $result->fetch_assoc()) {
            $attendance[] = $row;
        }
        
        echo json_encode(['success' => true, 'attendance' => $attendance]);
        $stmt->close();
    } elseif ($action === 'get_dashboard_overview') {
        $employee_id = $_GET['employee_id'] ?? '';
        $overview = ['attendance' => [], 'leave' => ['total_requests' => 0, 'pending_requests' => 0, 'approved_days_this_month' => 0]];

        for ($i = 6; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $stmt = $conn->prepare("SELECT status FROM attendance WHERE employee_id = ? AND date = ?");
            $stmt->bind_param('is', $employee_id, $date);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $overview['attendance'][] = ['label' => date('D', strtotime($date)), 'value' => $row && $row['status'] === 'present' ? 1 : 0];
        }

        $stmt = $conn->prepare("SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending FROM leave_requests WHERE employee_id = ?");
        $stmt->bind_param('i', $employee_id);
        $stmt->execute();
        $leave = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $overview['leave']['total_requests'] = (int)$leave['total'];
        $overview['leave']['pending_requests'] = (int)$leave['pending'];

        $month = date('Y-m');
        $stmt = $conn->prepare("SELECT COALESCE(SUM(total_days), 0) AS days FROM leave_requests WHERE employee_id = ? AND status = 'approved' AND DATE_FORMAT(start_date, '%Y-%m') = ?");
        $stmt->bind_param('is', $employee_id, $month);
        $stmt->execute();
        $overview['leave']['approved_days_this_month'] = (int)$stmt->get_result()->fetch_assoc()['days'];
        $stmt->close();

        echo json_encode(['success' => true, 'overview' => $overview]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    if (in_array($action, ['check_in', 'check_out'], true)) require_self_or_permission($conn, (int)($data['employee_id'] ?? 0), 'attendance.self');
    if ($action === 'update_profile') require_self_or_permission($conn, (int)($data['employee_id'] ?? 0), 'profile.self');
    if (in_array($action, ['request_leave'], true)) require_self_or_permission($conn, (int)($data['employee_id'] ?? 0), 'leaves.self');
    if (in_array($action, ['create_note', 'update_note', 'delete_note'], true)) require_self_or_permission($conn, (int)($data['employee_id'] ?? 0), 'notes.self');
    if (in_array($action, ['mark_notification_read'], true)) require_self_or_permission($conn, (int)($data['employee_id'] ?? 0), 'notifications.self');
    
    if ($action === 'check_in') {
        $employee_id = $data['employee_id'] ?? '';
        $date = date('Y-m-d');
        $time = date('H:i:s');
        $datetime = $date . ' ' . $time;

        $open_stmt = $conn->prepare("SELECT id FROM attendance WHERE employee_id = ? AND date = ? AND check_out_time IS NULL LIMIT 1");
        $open_stmt->bind_param("is", $employee_id, $date);
        $open_stmt->execute();
        if ($open_stmt->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Please check out of the current session first']);
            $open_stmt->close();
            exit;
        }
        $open_stmt->close();
        
        // Insert attendance record
        $stmt = $conn->prepare("INSERT INTO attendance (employee_id, check_in_time, date, status) VALUES (?, ?, ?, 'present')");
        $stmt->bind_param("iss", $employee_id, $datetime, $date);
        
        if ($stmt->execute()) {
            $attendanceId = $conn->insert_id;
            $log = $conn->prepare("INSERT INTO attendance_logs (attendance_id, employee_id, action, action_time) VALUES (?, ?, 'check_in', ?)");
            $log->bind_param('iis', $attendanceId, $employee_id, $datetime);
            $log->execute();
            $log->close();
            echo json_encode(['success' => true, 'message' => 'Checked in successfully', 'check_in_time' => date('h:i:s A')]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to check in']);
        }
        $stmt->close();
        
    } elseif ($action === 'check_out') {
        $employee_id = $data['employee_id'] ?? '';
        $checkout_reason = $data['checkout_reason'] ?? '';
        // Accept the current API field and the legacy browser field while
        // users refresh cached dashboard JavaScript.
        $work_update = trim((string)($data['work_update'] ?? $data['workUpdate'] ?? ''));
        if (!in_array($checkout_reason, ['break', 'complete', 'permission'], true)) {
            echo json_encode(['success' => false, 'message' => 'Choose a valid check-out reason']);
            exit;
        }
        if ($checkout_reason === 'complete' && $work_update === '') {
            echo json_encode(['success' => false, 'message' => 'A work update is required when marking work complete']);
            exit;
        }
        if (mb_strlen($work_update) > 5000) {
            echo json_encode(['success' => false, 'message' => 'Work update must be 5,000 characters or fewer']);
            exit;
        }
        $date = date('Y-m-d');
        $time = date('H:i:s');
        $datetime = $date . ' ' . $time;
        
        // Close the most recent session that is still open.
        $get_stmt = $conn->prepare("SELECT id, check_in_time FROM attendance WHERE employee_id = ? AND date = ? AND check_out_time IS NULL ORDER BY check_in_time DESC, id DESC LIMIT 1");
        $get_stmt->bind_param("is", $employee_id, $date);
        $get_stmt->execute();
        $get_result = $get_stmt->get_result();
        
        if ($get_result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'No check-in record found']);
            $get_stmt->close();
            exit;
        }
        
        $row = $get_result->fetch_assoc();
        $check_in_time = $row['check_in_time'];
        $get_stmt->close();
        
        // Calculate total hours
        $check_in = new DateTime($check_in_time);
        $check_out = new DateTime($datetime);
        $interval = $check_in->diff($check_out);
        $total_hours = $interval->h + ($interval->i / 60);
        
        // Update only the session selected above.
        $stmt = $conn->prepare("UPDATE attendance SET check_out_time = ?, total_hours = ?, checkout_reason = ? WHERE id = ?");
        $stmt->bind_param("sdsi", $datetime, $total_hours, $checkout_reason, $row['id']);
        
        $conn->begin_transaction();
        if ($stmt->execute()) {
            if ($checkout_reason === 'complete') {
                $workUpdateStmt = $conn->prepare('INSERT INTO work_updates (employee_id, attendance_id, work_update, work_date) VALUES (?, ?, ?, ?)');
                $workUpdateStmt->bind_param('iiss', $employee_id, $row['id'], $work_update, $date);
                if (!$workUpdateStmt->execute()) {
                    $workUpdateStmt->close();
                    $conn->rollback();
                    echo json_encode(['success' => false, 'message' => 'Could not save the work update. Please try again.']);
                    exit;
                }
                $workUpdateStmt->close();
            }
            $log = $conn->prepare("INSERT INTO attendance_logs (attendance_id, employee_id, action, action_time, reason) VALUES (?, ?, 'check_out', ?, ?)");
            $log->bind_param('iiss', $row['id'], $employee_id, $datetime, $checkout_reason);
            $log->execute();
            $log->close();
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Checked out successfully', 'check_out_time' => date('h:i:s A'), 'total_hours' => round($total_hours, 2), 'checkout_reason' => $checkout_reason]);
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to check out']);
        }
        $stmt->close();
        
    } elseif ($action === 'update_profile') {
        $employee_id = $data['employee_id'] ?? '';
        $phone = $data['phone'] ?? '';
        $date_of_birth = $data['date_of_birth'] ?? '';
        $gender = $data['gender'] ?? '';
        $address = $data['address'] ?? '';
        $city = $data['city'] ?? '';
        $state = $data['state'] ?? '';
        $pincode = $data['pincode'] ?? '';
        
        if (empty($employee_id)) {
            echo json_encode(['success' => false, 'message' => 'Employee ID is required']);
            exit;
        }
        
        if (empty($phone)) {
            echo json_encode(['success' => false, 'message' => 'Phone number is required']);
            exit;
        }
        
        // Validate phone
        if (!preg_match('/^[0-9]{10}$/', $phone)) {
            echo json_encode(['success' => false, 'message' => 'Phone number must be 10 digits']);
            exit;
        }
        
        // Validate pincode if provided
        if (!empty($pincode) && !preg_match('/^[0-9]{6}$/', $pincode)) {
            echo json_encode(['success' => false, 'message' => 'Pincode must be 6 digits']);
            exit;
        }
        
        // Update employee profile
        $stmt = $conn->prepare("UPDATE employees SET phone = ?, date_of_birth = ?, gender = ?, address = ?, city = ?, state = ?, pincode = ? WHERE id = ?");
        $stmt->bind_param("sssssssi", $phone, $date_of_birth, $gender, $address, $city, $state, $pincode, $employee_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update profile: ' . $conn->error]);
        }
        $stmt->close();
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
