<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../config/permissions.php';
require_once 'email-functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    $map = ['get_projects'=>'projects.read','get_project_details'=>'projects.read','get_project_stats'=>'projects.read','get_project_assignments'=>'projects.read'];
    if (isset($map[$action])) require_permission($conn, $map[$action]);
    
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
    $map = ['create_project'=>'projects.create','update_project'=>'projects.update','assign_employee'=>'projects.update','remove_employee'=>'projects.update','delete_project'=>'projects.delete'];
    if (isset($map[$action])) require_permission($conn, $map[$action]);
    
    if ($action === 'create_project') {
        $employee_id = (int)($data['employee_id'] ?? 0);
        $conn->begin_transaction();
        $stmt = $conn->prepare("INSERT INTO projects (name, description, client_name, start_date, end_date, budget, status, priority, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss" . "d" . "ssi", $data['name'], $data['description'], $data['client_name'], $data['start_date'], $data['end_date'], $data['budget'], $data['status'], $data['priority'], $data['progress']);
        if (!$stmt->execute()) { $conn->rollback(); echo json_encode(['success' => false, 'message' => 'Failed to create project']); $stmt->close(); exit; }
        $project_id = $conn->insert_id;
        if ($employee_id > 0) {
            $assign = $conn->prepare('INSERT INTO project_assignments (project_id, employee_id, role) VALUES (?, ?, ?)');
            $role = 'team_member'; $assign->bind_param('iis', $project_id, $employee_id, $role);
            if (!$assign->execute()) { $conn->rollback(); echo json_encode(['success' => false, 'message' => 'Failed to assign employee']); $assign->close(); $stmt->close(); exit; }
            $assign->close();
        }
        $conn->commit();
        if ($employee_id > 0) send_project_assignment_email($conn, $employee_id, $project_id, $data, true);
        echo json_encode(['success' => true, 'message' => 'Project created successfully']);
        $stmt->close();
        
    } elseif ($action === 'update_project') {
        $employee_id = (int)($data['employee_id'] ?? 0);
        $old_employee_id = 0;
        $old = $conn->prepare('SELECT employee_id FROM project_assignments WHERE project_id = ? ORDER BY id LIMIT 1');
        $old->bind_param('i', $data['id']); $old->execute(); $old_employee_id = (int)($old->get_result()->fetch_assoc()['employee_id'] ?? 0); $old->close();
        $stmt = $conn->prepare("UPDATE projects SET name = ?, description = ?, client_name = ?, start_date = ?, end_date = ?, budget = ?, status = ?, priority = ?, progress = ? WHERE id = ?");
        $stmt->bind_param("sssss" . "d" . "ssii", $data['name'], $data['description'], $data['client_name'], $data['start_date'], $data['end_date'], $data['budget'], $data['status'], $data['priority'], $data['progress'], $data['id']);
        
        if (!$stmt->execute()) { echo json_encode(['success' => false, 'message' => 'Failed to update project']); $stmt->close(); exit; }
        $clear = $conn->prepare('DELETE FROM project_assignments WHERE project_id = ?'); $clear->bind_param('i', $data['id']); $clear->execute(); $clear->close();
        if ($employee_id > 0) { $assign = $conn->prepare('INSERT INTO project_assignments (project_id, employee_id, role) VALUES (?, ?, ?)'); $role = 'team_member'; $assign->bind_param('iis', $data['id'], $employee_id, $role); $assign->execute(); $assign->close(); }
        if ($employee_id > 0 && $employee_id !== $old_employee_id) send_project_assignment_email($conn, $employee_id, (int)$data['id'], $data, true);
        echo json_encode(['success' => true, 'message' => 'Project updated successfully']);
        $stmt->close();
        
    } elseif ($action === 'assign_employee') {
        $stmt = $conn->prepare("INSERT INTO project_assignments (project_id, employee_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = ?");
        $stmt->bind_param("iiss", $data['project_id'], $data['employee_id'], $data['role'], $data['role']);
        
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

function send_project_assignment_email($conn, $employee_id, $project_id, $project, $send) {
    if (!$send) return;
    $stmt = $conn->prepare('SELECT full_name, email FROM employees WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $employee_id); $stmt->execute(); $employee = $stmt->get_result()->fetch_assoc(); $stmt->close();
    if (!$employee || !filter_var($employee['email'], FILTER_VALIDATE_EMAIL)) return;
    try { $send_assignment = 'send_project_assignment_to_employee'; $send_assignment($employee['full_name'], $employee['email'], $project['name'], $project); }
    catch (Throwable $e) { error_log('Project assignment email failed: ' . $e->getMessage()); }
}

$conn->close();
?>
