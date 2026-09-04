<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Disable display errors to prevent corrupting JSON
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../config/permissions.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    $permissionMap = ['get_notes' => 'notes.read', 'get_employees' => 'notes.read'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);
    $user_id = $_GET['user_id'] ?? 0;

    if ($action === 'get_notes') {
        if (empty($user_id)) {
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            exit;
        }
        
        try {
            // Get all notes for a user (both sent and received)
            // Simplified query to avoid JSON parsing issues
            $stmt = $conn->prepare("
                SELECT n.*, 
                       COALESCE(e_sender.full_name, u_sender.phone) as sender_name,
                       COALESCE(e_receiver.full_name, u_receiver.phone) as receiver_name,
                       e_sender.employee_code as sender_code,
                       e_receiver.employee_code as receiver_code
                FROM notes n
                LEFT JOIN users u_sender ON n.sender_id = u_sender.id
                LEFT JOIN users u_receiver ON n.receiver_id = u_receiver.id
                LEFT JOIN employees e_sender ON n.sender_id = e_sender.user_id
                LEFT JOIN employees e_receiver ON n.receiver_id = e_receiver.user_id
                WHERE n.sender_id = ? OR n.receiver_id = ?
                ORDER BY n.created_at DESC
            ");
            $stmt->bind_param("ii", $user_id, $user_id);
            
            if (!$stmt->execute()) {
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
                exit;
            }
            
            $result = $stmt->get_result();
            $notes = [];

            while ($row = $result->fetch_assoc()) {
                $notes[] = $row;
            }

            echo json_encode(['success' => true, 'notes' => $notes]);
            exit;
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
            exit;
        }
    }

    if ($action === 'get_employees') {
        try {
            // Get all active employees for admin dropdown
            // full_name is in employees table, not users table
            $stmt = $conn->prepare("
                SELECT u.id, e.full_name, e.employee_code 
                FROM users u
                INNER JOIN employees e ON u.id = e.user_id
                WHERE u.role = 'employee'
                ORDER BY e.full_name ASC
            ");
            $stmt->execute();
            $result = $stmt->get_result();
            $employees = [];

            while ($row = $result->fetch_assoc()) {
                $employees[] = $row;
            }

            echo json_encode(['success' => true, 'employees' => $employees]);
            exit;
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
            exit;
        }
    }

    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $action = $data['action'] ?? '';
    $permissionMap = ['create_note' => 'notes.create', 'update_note' => 'notes.update'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);

    if ($action === 'create_note') {
        $sender_id = $data['sender_id'] ?? 0;
        $receiver_id = $data['receiver_id'] ?? 0;
        $sender_type = $data['sender_type'] ?? 'employee';
        $receiver_type = $data['receiver_type'] ?? 'employee';
        $subject = $data['subject'] ?? '';
        $message = $data['message'] ?? '';

        if (empty($sender_id) || empty($receiver_id) || empty($message)) {
            echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
            exit;
        }

        $stmt = $conn->prepare("
            INSERT INTO notes (sender_id, receiver_id, sender_type, receiver_type, subject, message)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("iissss", $sender_id, $receiver_id, $sender_type, $receiver_type, $subject, $message);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Note sent successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send note']);
        }
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    $action = $data['action'] ?? '';
    $permissionMap = ['mark_read' => 'notes.update', 'update_note' => 'notes.update'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);

    if ($action === 'mark_read') {
        $note_id = $data['note_id'] ?? 0;

        if (empty($note_id)) {
            echo json_encode(['success' => false, 'message' => 'Note ID is required']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE notes SET is_read = TRUE WHERE id = ?");
        $stmt->bind_param("i", $note_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Note marked as read']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to mark note as read']);
        }
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $action = $_GET['action'] ?? '';
    $permissionMap = ['delete_note' => 'notes.delete'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);
    
    $note_id = $_GET['note_id'] ?? 0;

    if (empty($note_id)) {
        echo json_encode(['success' => false, 'message' => 'Note ID is required']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM notes WHERE id = ?");
    $stmt->bind_param("i", $note_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Note deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete note']);
    }
    exit;
}
