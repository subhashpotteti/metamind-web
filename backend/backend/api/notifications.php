<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'get_notifications') {
        $user_id = $_GET['user_id'] ?? '';
        
        $stmt = $conn->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $notifications = [];
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
        
        echo json_encode(['success' => true, 'notifications' => $notifications]);
        $stmt->close();
        
    } elseif ($action === 'get_unread_count') {
        $user_id = $_GET['user_id'] ?? '';
        
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $count = $result->fetch_assoc()['count'];
        
        echo json_encode(['success' => true, 'count' => $count]);
        $stmt->close();
        
    } elseif ($action === 'mark_as_read') {
        $notification_id = $_GET['notification_id'] ?? '';
        
        $stmt = $conn->prepare("UPDATE notifications SET is_read = TRUE WHERE id = ?");
        $stmt->bind_param("i", $notification_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Notification marked as read']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to mark as read']);
        }
        $stmt->close();
        
    } elseif ($action === 'mark_all_as_read') {
        $user_id = $_GET['user_id'] ?? '';
        
        $stmt = $conn->prepare("UPDATE notifications SET is_read = TRUE WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'All notifications marked as read']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to mark all as read']);
        }
        $stmt->close();
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    
    if ($action === 'create_notification') {
        $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $data['user_id'], $data['title'], $data['message'], $data['type'], $data['link']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Notification created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create notification']);
        }
        $stmt->close();
        
    } elseif ($action === 'bulk_notify') {
        // Send notification to multiple users
        $user_ids = $data['user_ids'] ?? [];
        $title = $data['title'] ?? '';
        $message = $data['message'] ?? '';
        $type = $data['type'] ?? 'info';
        $link = $data['link'] ?? '';
        
        $success_count = 0;
        foreach ($user_ids as $user_id) {
            $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("issss", $user_id, $title, $message, $type, $link);
            if ($stmt->execute()) {
                $success_count++;
            }
            $stmt->close();
        }
        
        echo json_encode(['success' => true, 'message' => "Sent $success_count notifications"]);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
