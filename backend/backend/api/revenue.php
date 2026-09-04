<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../config/permissions.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    $map = ['get_revenue'=>'revenue.read','get_revenue_stats'=>'revenue.read','get_revenue_details'=>'revenue.read'];
    if (isset($map[$action])) require_permission($conn, $map[$action]);
    
    if ($action === 'get_revenue') {
        $stmt = $conn->prepare("SELECT r.*, p.name as project_name FROM revenue r LEFT JOIN projects p ON r.project_id = p.id ORDER BY r.date DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $revenue = [];
        while ($row = $result->fetch_assoc()) {
            $revenue[] = $row;
        }
        
        echo json_encode(['success' => true, 'revenue' => $revenue]);
        $stmt->close();
        
    } elseif ($action === 'get_revenue_stats') {
        $stats = [];
        
        // Total revenue
        $result = $conn->query("SELECT SUM(amount) as total FROM revenue WHERE type = 'payment_received'");
        $stats['total_revenue'] = $result->fetch_assoc()['total'] ?? 0;
        
        // Pending revenue
        $result = $conn->query("SELECT SUM(amount) as total FROM revenue WHERE type = 'pending'");
        $stats['pending_revenue'] = $result->fetch_assoc()['total'] ?? 0;
        
        // Invoice sent
        $result = $conn->query("SELECT SUM(amount) as total FROM revenue WHERE type = 'invoice_sent'");
        $stats['invoice_sent'] = $result->fetch_assoc()['total'] ?? 0;
        
        // This month revenue
        $this_month = date('Y-m');
        $stmt = $conn->prepare("SELECT SUM(amount) as total FROM revenue WHERE type = 'payment_received' AND DATE_FORMAT(date, '%Y-%m') = ?");
        $stmt->bind_param("s", $this_month);
        $stmt->execute();
        $stats['this_month_revenue'] = $stmt->get_result()->fetch_assoc()['total'] ?? 0;
        $stmt->close();
        
        // Monthly revenue for chart (last 6 months)
        $monthly_data = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = date('Y-m', strtotime("-$i months"));
            $stmt = $conn->prepare("SELECT SUM(amount) as total FROM revenue WHERE type = 'payment_received' AND DATE_FORMAT(date, '%Y-%m') = ?");
            $stmt->bind_param("s", $month);
            $stmt->execute();
            $total = $stmt->get_result()->fetch_assoc()['total'] ?? 0;
            $monthly_data[] = [
                'month' => date('M Y', strtotime($month)),
                'amount' => $total
            ];
            $stmt->close();
        }
        $stats['monthly_data'] = $monthly_data;
        
        echo json_encode(['success' => true, 'stats' => $stats]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    $map = ['add_revenue'=>'revenue.create','update_revenue'=>'revenue.update','delete_revenue'=>'revenue.delete'];
    if (isset($map[$action])) require_permission($conn, $map[$action]);
    
    if ($action === 'add_revenue') {
        $stmt = $conn->prepare("INSERT INTO revenue (project_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("idsss", $data['project_id'], $data['amount'], $data['type'], $data['description'], $data['date']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Revenue added successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add revenue']);
        }
        $stmt->close();
        
    } elseif ($action === 'update_revenue') {
        $stmt = $conn->prepare("UPDATE revenue SET project_id = ?, amount = ?, type = ?, description = ?, date = ? WHERE id = ?");
        $stmt->bind_param("idsssi", $data['project_id'], $data['amount'], $data['type'], $data['description'], $data['date'], $data['id']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Revenue updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update revenue']);
        }
        $stmt->close();
        
    } elseif ($action === 'delete_revenue') {
        $stmt = $conn->prepare("DELETE FROM revenue WHERE id = ?");
        $stmt->bind_param("i", $data['revenue_id']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Revenue deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete revenue']);
        }
        $stmt->close();
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
