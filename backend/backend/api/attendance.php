<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');
date_default_timezone_set('Asia/Kolkata');


require_once '../config/database.php';
require_once '../config/permissions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $action = $data['action'] ?? '';
    $employee_id = $data['employee_id'] ?? '';

    $permissionMap = ['check_in' => 'attendance.create', 'check_out' => 'attendance.update', 'update_attendance' => 'attendance.update', 'delete_attendance' => 'attendance.delete'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);

    if (empty($employee_id)) {
        echo json_encode(['success' => false, 'message' => 'Employee ID is required']);
        exit;
    }

    $today = date('Y-m-d');

    if ($action === 'check_in') {
        $open_stmt = $conn->prepare("SELECT id FROM attendance WHERE employee_id = ? AND date = ? AND check_out_time IS NULL LIMIT 1");
        $open_stmt->bind_param("is", $employee_id, $today);
        $open_stmt->execute();
        if ($open_stmt->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Please check out of the current session first']);
            $open_stmt->close();
            exit;
        }
        $open_stmt->close();

        // Insert check-in record
        $check_in_time = date('Y-m-d H:i:s');

        $stmt = $conn->prepare("INSERT INTO attendance (employee_id, check_in_time, date, status)
VALUES (?, ?, ?, 'present')");
        $stmt->bind_param("iss", $employee_id, $check_in_time, $today);

        if ($stmt->execute()) {
            $attendanceId = $conn->insert_id;
            $log = $conn->prepare("INSERT INTO attendance_logs (attendance_id, employee_id, action, action_time) VALUES (?, ?, 'check_in', ?)");
            $log->bind_param('iis', $attendanceId, $employee_id, $check_in_time);
            $log->execute();
            $log->close();
            echo json_encode(['success' => true, 'message' => 'Checked in successfully', 'check_in_time' => date('h:i:s A')]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to check in']);
        }

        $stmt->close();
    } elseif ($action === 'check_out') {
        $checkout_reason = $data['checkout_reason'] ?? '';
        if (!in_array($checkout_reason, ['break', 'complete', 'permission'], true)) {
            echo json_encode(['success' => false, 'message' => 'Choose a valid check-out reason']);
            exit;
        }
        // Close the most recent session that is still open.
        $stmt = $conn->prepare("
SELECT id, check_in_time, check_out_time
FROM attendance
    WHERE employee_id = ? AND date = ? AND check_out_time IS NULL
    ORDER BY check_in_time DESC, id DESC
    LIMIT 1
");
        $stmt->bind_param("is", $employee_id, $today);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'No check-in record found for today']);
            exit;
        }

        $row = $result->fetch_assoc();

        // Update check-out time
        $check_out_time = date('Y-m-d H:i:s');

        $update_stmt = $conn->prepare("UPDATE attendance SET check_out_time = ?, checkout_reason = ? WHERE id = ?");
        $update_stmt->bind_param("ssi", $check_out_time, $checkout_reason, $row['id']);

        if ($update_stmt->execute()) {
            // Calculate total hours
            $check_in = strtotime($row['check_in_time']);
            $check_out = strtotime($check_out_time);
            $total_hours = round(($check_out - $check_in) / 3600, 2);

            // Update total hours
            $hours_stmt = $conn->prepare("UPDATE attendance SET total_hours = ? WHERE id = ?");
            $hours_stmt->bind_param("di", $total_hours, $row['id']);
            $hours_stmt->execute();
            $hours_stmt->close();
            $log = $conn->prepare("INSERT INTO attendance_logs (attendance_id, employee_id, action, action_time, reason) VALUES (?, ?, 'check_out', ?, ?)");
            $log->bind_param('iiss', $row['id'], $employee_id, $check_out_time, $checkout_reason);
            $log->execute();
            $log->close();

            echo json_encode([
                'success' => true,
                'message' => 'Checked out successfully',
                'check_out_time' => date('h:i:s A'),
                'total_hours' => $total_hours
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to check out']);
        }

        $update_stmt->close();
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    $permissionMap = ['get_attendance' => 'attendance.read', 'get_attendance_records' => 'attendance.read'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);
    
    $employee_id = $_GET['employee_id'] ?? '';

    if (empty($employee_id)) {
        echo json_encode(['success' => false, 'message' => 'Employee ID is required']);
        exit;
    }

    // Get attendance records
    $stmt = $conn->prepare("SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT 30");
    $stmt->bind_param("i", $employee_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $attendance_records = [];
    while ($row = $result->fetch_assoc()) {
        $attendance_records[] = $row;
    }

    // Get today's status
    $today = date('Y-m-d');
    $today_stmt = $conn->prepare("SELECT *, COALESCE((SELECT SUM(total_hours) FROM attendance WHERE employee_id = ? AND date = ?), 0) AS day_total_hours FROM attendance WHERE employee_id = ? AND date = ? ORDER BY check_in_time DESC, id DESC LIMIT 1");
    $today_stmt->bind_param("isis", $employee_id, $today, $employee_id, $today);
    $today_stmt->execute();
    $today_result = $today_stmt->get_result();
    $today_record = $today_result->num_rows > 0 ? $today_result->fetch_assoc() : null;

    echo json_encode([
        'success' => true,
        'attendance' => $attendance_records,
        'today' => $today_record
    ]);

    $stmt->close();
    $today_stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
