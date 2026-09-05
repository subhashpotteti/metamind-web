<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../config/permissions.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    $permissionMap = ['get_leave_requests' => 'leaves.read', 'get_employee_leaves' => 'leaves.read', 'get_leave_stats' => 'leaves.read'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);
    
    if ($action === 'get_leave_requests') {
        $where = []; $params = []; $types = '';
        if (!empty($_GET['from_date'])) { $where[] = 'lr.start_date >= ?'; $params[] = $_GET['from_date']; $types .= 's'; }
        if (!empty($_GET['to_date'])) { $where[] = 'lr.end_date <= ?'; $params[] = $_GET['to_date']; $types .= 's'; }
        if (!empty($_GET['employee_id'])) { $where[] = 'lr.employee_id = ?'; $params[] = (int)$_GET['employee_id']; $types .= 'i'; }
        $sql = "SELECT lr.*, e.full_name, e.department, e.designation FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id" . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY lr.created_at DESC';
        $stmt = $conn->prepare($sql); if ($params) $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        
        echo json_encode(['success' => true, 'requests' => $requests]);
        $stmt->close();
        
    } elseif ($action === 'get_employee_leaves') {
        $employee_id = $_GET['employee_id'] ?? '';
        
        $stmt = $conn->prepare("SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC");
        $stmt->bind_param("i", $employee_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        
        echo json_encode(['success' => true, 'requests' => $requests]);
        $stmt->close();
        
    } elseif ($action === 'get_leave_stats') {
        $stats = [];
        
        // Pending requests
        $result = $conn->query("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'");
        $stats['pending_requests'] = $result->fetch_assoc()['count'];
        
        // Approved this month
        $this_month = date('Y-m');
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'approved' AND DATE_FORMAT(start_date, '%Y-%m') = ?");
        $stmt->bind_param("s", $this_month);
        $stmt->execute();
        $stats['approved_this_month'] = $stmt->get_result()->fetch_assoc()['count'];
        $stmt->close();
        
        // Leave by type
        $result = $conn->query("SELECT leave_type, COUNT(*) as count FROM leave_requests WHERE status = 'approved' GROUP BY leave_type");
        $leave_by_type = [];
        while ($row = $result->fetch_assoc()) {
            $leave_by_type[] = $row;
        }
        $stats['leave_by_type'] = $leave_by_type;
        
        echo json_encode(['success' => true, 'stats' => $stats]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    $permissionMap = ['request_leave' => 'leaves.create', 'approve_leave' => 'leaves.update', 'reject_leave' => 'leaves.update', 'delete_leave' => 'leaves.delete'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);
    
    if ($action === 'request_leave') {
        $stmt = $conn->prepare("INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssis", $data['employee_id'], $data['leave_type'], $data['start_date'], $data['end_date'], $data['total_days'], $data['reason']);
        
        if ($stmt->execute()) {
            // Get employee details for email
            $emp_stmt = $conn->prepare("SELECT e.full_name, e.employee_code, e.email FROM employees e WHERE e.id = ?");
            $emp_stmt->bind_param("i", $data['employee_id']);
            $emp_stmt->execute();
            $emp_result = $emp_stmt->get_result();
            $employee = $emp_result->fetch_assoc();
            $emp_stmt->close();
            
            // Send emails but don't fail if it errors
            $email_sent = false;
            $email_error = '';
            if ($employee) {
                try {
                    require_once 'email-functions.php';
                    $result1 = send_leave_request_to_admin($employee['full_name'], $employee['employee_code'], $employee['email'], $data['leave_type'], $data['start_date'], $data['end_date'], $data['reason']);
                    $result2 = send_leave_request_confirmation_to_employee($employee['full_name'], $employee['email'], $data['leave_type'], $data['start_date'], $data['end_date']);
                    $email_sent = ($result1['success'] && $result2['success']);
                    if (!$email_sent) {
                        $email_error = $result1['message'] ?? $result2['message'] ?? 'Email sending partially failed';
                    }
                } catch (Exception $e) {
                    $email_error = $e->getMessage();
                    error_log("Email sending failed: " . $e->getMessage());
                }
            }
            
            // Create notification for admin
            $admin_stmt = $conn->prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
            $admin_stmt->execute();
            $admin_result = $admin_stmt->get_result();
            $admin = $admin_result->fetch_assoc();
            
            if ($admin) {
                $notif_stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'leave', ?)");
                $title = 'New Leave Request';
                $message = 'A new leave request has been submitted';
                $link = 'admin/leaves.php';
                $notif_stmt->bind_param("isss", $admin['id'], $title, $message, $link);
                $notif_stmt->execute();
                $notif_stmt->close();
            }
            
            $message = $email_sent 
                ? 'Leave request submitted successfully and emails sent to both admin and employee.' 
                : 'Leave request submitted successfully. Note: ' . $email_error;
            
            echo json_encode(['success' => true, 'message' => $message, 'email_sent' => $email_sent]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to submit leave request']);
        }
        $stmt->close();
        
    } elseif ($action === 'approve_leave') {
        $stmt = $conn->prepare("UPDATE leave_requests SET status = 'approved', admin_notes = ? WHERE id = ?");
        $stmt->bind_param("si", $data['admin_notes'], $data['leave_id']);
        
        if ($stmt->execute()) {
            // Get employee details for email
            $emp_stmt = $conn->prepare("SELECT e.full_name, e.employee_code, e.email, lr.leave_type, lr.start_date, lr.end_date FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id WHERE lr.id = ?");
            $emp_stmt->bind_param("i", $data['leave_id']);
            $emp_stmt->execute();
            $emp_result = $emp_stmt->get_result();
            $employee = $emp_result->fetch_assoc();
            $emp_stmt->close();
            
            // Send emails but don't fail if it errors
            $email_sent = false;
            $email_error = '';
            if ($employee) {
                try {
                    require_once 'email-functions.php';
                    $result1 = send_leave_decision_to_employee($employee['full_name'], $employee['email'], $employee['leave_type'], $employee['start_date'], $employee['end_date'], 'approved', $data['admin_notes']);
                    $result2 = send_leave_decision_to_admin($employee['full_name'], $employee['employee_code'], $employee['leave_type'], $employee['start_date'], $employee['end_date'], 'approved');
                    $email_sent = ($result1['success'] && $result2['success']);
                    if (!$email_sent) {
                        $email_error = $result1['message'] ?? $result2['message'] ?? 'Email sending partially failed';
                    }
                } catch (Exception $e) {
                    $email_error = $e->getMessage();
                    error_log("Email sending failed: " . $e->getMessage());
                }
            }
            
            // Get employee user_id for notification
            $emp_stmt = $conn->prepare("SELECT user_id FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id WHERE lr.id = ?");
            $emp_stmt->bind_param("i", $data['leave_id']);
            $emp_stmt->execute();
            $emp_result = $emp_stmt->get_result();
            $emp = $emp_result->fetch_assoc();
            
            if ($emp) {
                $notif_stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'success', ?)");
                $title = 'Leave Approved';
                $message = 'Your leave request has been approved';
                $link = 'employee/leaves.php';
                $notif_stmt->bind_param("isss", $emp['user_id'], $title, $message, $link);
                $notif_stmt->execute();
                $notif_stmt->close();
            }
            
            $message = $email_sent 
                ? 'Leave approved successfully and emails sent to both admin and employee.' 
                : 'Leave approved successfully. Note: ' . $email_error;
            
            echo json_encode(['success' => true, 'message' => $message, 'email_sent' => $email_sent]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to approve leave']);
        }
        $stmt->close();
        
    } elseif ($action === 'reject_leave') {
        $stmt = $conn->prepare("UPDATE leave_requests SET status = 'rejected', admin_notes = ? WHERE id = ?");
        $stmt->bind_param("si", $data['admin_notes'], $data['leave_id']);
        
        if ($stmt->execute()) {
            // Get employee details for email
            $emp_stmt = $conn->prepare("SELECT e.full_name, e.employee_code, e.email, lr.leave_type, lr.start_date, lr.end_date FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id WHERE lr.id = ?");
            $emp_stmt->bind_param("i", $data['leave_id']);
            $emp_stmt->execute();
            $emp_result = $emp_stmt->get_result();
            $employee = $emp_result->fetch_assoc();
            $emp_stmt->close();
            
            // Send emails but don't fail if it errors
            $email_sent = false;
            $email_error = '';
            if ($employee) {
                try {
                    require_once 'email-functions.php';
                    $result1 = send_leave_decision_to_employee($employee['full_name'], $employee['email'], $employee['leave_type'], $employee['start_date'], $employee['end_date'], 'rejected', $data['admin_notes']);
                    $result2 = send_leave_decision_to_admin($employee['full_name'], $employee['employee_code'], $employee['leave_type'], $employee['start_date'], $employee['end_date'], 'rejected');
                    $email_sent = ($result1['success'] && $result2['success']);
                    if (!$email_sent) {
                        $email_error = $result1['message'] ?? $result2['message'] ?? 'Email sending partially failed';
                    }
                } catch (Exception $e) {
                    $email_error = $e->getMessage();
                    error_log("Email sending failed: " . $e->getMessage());
                }
            }
            
            // Get employee user_id for notification
            $emp_stmt = $conn->prepare("SELECT user_id FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id WHERE lr.id = ?");
            $emp_stmt->bind_param("i", $data['leave_id']);
            $emp_stmt->execute();
            $emp_result = $emp_stmt->get_result();
            $emp = $emp_result->fetch_assoc();
            
            if ($emp) {
                $notif_stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'warning', ?)");
                $title = 'Leave Rejected';
                $message = 'Your leave request has been rejected';
                $link = 'employee/leaves.php';
                $notif_stmt->bind_param("isss", $emp['user_id'], $title, $message, $link);
                $notif_stmt->execute();
                $notif_stmt->close();
            }
            
            $message = $email_sent 
                ? 'Leave rejected successfully and email sent to both admin and employee.' 
                : 'Leave rejected successfully. Note: ' . $email_error;
            
            echo json_encode(['success' => true, 'message' => $message, 'email_sent' => $email_sent]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to reject leave']);
        }
        $stmt->close();
    } elseif ($action === 'delete_leave') {
        $leave_id = (int)($data['leave_id'] ?? 0);
        if ($leave_id <= 0) { echo json_encode(['success' => false, 'message' => 'Leave request ID is required']); exit; }
        $stmt = $conn->prepare('DELETE FROM leave_requests WHERE id = ?'); $stmt->bind_param('i', $leave_id);
        echo json_encode($stmt->execute() ? ['success' => true, 'message' => 'Leave request deleted successfully'] : ['success' => false, 'message' => 'Failed to delete leave request']); $stmt->close();
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
