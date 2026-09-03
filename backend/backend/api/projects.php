<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'get_projects') {
        $stmt = $conn->prepare("SELECT p.*, 
            (SELECT COUNT(*) FROM project_assignments WHERE project_id = p.id) as team_size,
            (SELECT SUM(amount) FROM revenue WHERE project_id = p.id AND type = 'payment_received') as revenue_received
            FROM projects p ORDER BY p.created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $projects = [];
        while ($row = $result->fetch_assoc()) {
            $projects[] = $row;
        }
        
        echo json_encode(['success' => true, 'projects' => $projects]);
        $stmt->close();
        
    } elseif ($action === 'get_project_details') {
        $project_id = $_GET['project_id'] ?? '';
        
        $stmt = $conn->prepare("SELECT p.*, 
            (SELECT GROUP_CONCAT(e.full_name) FROM project_assignments pa JOIN employees e ON pa.employee_id = e.id WHERE pa.project_id = p.id) as team_members
            FROM projects p WHERE p.id = ?");
        $stmt->bind_param("i", $project_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $project = $result->fetch_assoc();
            
            // Get project assignments
            $assign_stmt = $conn->prepare("SELECT pa.*, e.full_name, e.department, e.designation FROM project_assignments pa JOIN employees e ON pa.employee_id = e.id WHERE pa.project_id = ?");
            $assign_stmt->bind_param("i", $project_id);
            $assign_stmt->execute();
            $assign_result = $assign_stmt->get_result();
            
            $assignments = [];
            while ($row = $assign_result->fetch_assoc()) {
                $assignments[] = $row;
            }
            
            $project['assignments'] = $assignments;
            
            echo json_encode(['success' => true, 'project' => $project]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Project not found']);
        }
        
        $stmt->close();
        
    } elseif ($action === 'get_project_stats') {
        $stats = [];
        
        // Total projects
        $result = $conn->query("SELECT COUNT(*) as count FROM projects");
        $stats['total_projects'] = $result->fetch_assoc()['count'];
        
        // Active projects
        $result = $conn->query("SELECT COUNT(*) as count FROM projects WHERE status = 'in_progress'");
        $stats['active_projects'] = $result->fetch_assoc()['count'];
        
        // Completed projects
        $result = $conn->query("SELECT COUNT(*) as count FROM projects WHERE status = 'completed'");
        $stats['completed_projects'] = $result->fetch_assoc()['count'];
        
        // Total budget
        $result = $conn->query("SELECT SUM(budget) as total FROM projects");
        $stats['total_budget'] = $result->fetch_assoc()['total'] ?? 0;
        
        echo json_encode(['success' => true, 'stats' => $stats]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    
    if ($action === 'create_project') {
        $stmt = $conn->prepare("INSERT INTO projects (name, description, client_name, start_date, end_date, budget, status, priority, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssdsisi", $data['name'], $data['description'], $data['client_name'], $data['start_date'], $data['end_date'], $data['budget'], $data['status'], $data['priority'], $data['progress']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Project created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create project']);
        }
        $stmt->close();
        
    } elseif ($action === 'update_project') {
        $stmt = $conn->prepare("UPDATE projects SET name = ?, description = ?, client_name = ?, start_date = ?, end_date = ?, budget = ?, status = ?, priority = ?, progress = ? WHERE id = ?");
        $stmt->bind_param("ssssdsisii", $data['name'], $data['description'], $data['client_name'], $data['start_date'], $data['end_date'], $data['budget'], $data['status'], $data['priority'], $data['progress'], $data['id']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Project updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update project']);
        }
        $stmt->close();
        
    } elseif ($action === 'assign_employee') {
        $stmt = $conn->prepare("INSERT INTO project_assignments (project_id, employee_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = ?");
        $stmt->bind_param("iiis", $data['project_id'], $data['employee_id'], $data['role'], $data['role']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Employee assigned successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to assign employee']);
        }
        $stmt->close();
        
    } elseif ($action === 'remove_employee') {
        $stmt = $conn->prepare("DELETE FROM project_assignments WHERE project_id = ? AND employee_id = ?");
        $stmt->bind_param("ii", $data['project_id'], $data['employee_id']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Employee removed successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to remove employee']);
        }
        $stmt->close();
        
    } elseif ($action === 'delete_project') {
        $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->bind_param("i", $data['project_id']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Project deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete project']);
        }
        $stmt->close();
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
