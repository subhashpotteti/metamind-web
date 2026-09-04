<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    require_once '../config/database.php';
    require_once '../config/permissions.php';
    ensure_employee_code_column($conn);
} catch (Exception $e) {
    error_log('Database connection error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    $permissionMap = ['get_requests' => 'requests.read', 'get_all_requests' => 'requests.read', 'get_employees' => 'employees.read', 'get_employee_details' => 'employees.read', 'get_attendance' => 'attendance.read', 'get_dashboard_stats' => 'dashboard.view', 'get_dashboard_analytics' => 'dashboard.view', 'get_role_permissions' => 'roles.manage', 'get_leaves' => 'leaves.read', 'get_notes' => 'notes.read', 'get_notifications' => 'notifications.read', 'get_tasks' => 'tasks.read'];
    if (isset($permissionMap[$action])) require_permission($conn, $permissionMap[$action]);

    if ($action === 'get_admin_id') {
        // Get admin user ID
        $stmt = $conn->prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            echo json_encode(['success' => true, 'admin_id' => $admin['id']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No admin user found']);
        }
        $stmt->close();
    } elseif ($action === 'get_admin_profile') {
        if (($_SESSION['role'] ?? '') !== 'admin') { http_response_code(403); echo json_encode(['success' => false, 'message' => 'Admin access required']); exit; }
        $admin_id = (int)($_GET['admin_id'] ?? 0);
        $stmt = $conn->prepare("SELECT id, phone, role, created_at, updated_at FROM users WHERE id = ? AND role = 'admin'");
        $stmt->bind_param('i', $admin_id);
        $stmt->execute();
        $admin = $stmt->get_result()->fetch_assoc();
        echo json_encode($admin ? ['success' => true, 'admin' => $admin] : ['success' => false, 'message' => 'Admin not found']);
        $stmt->close();
    } elseif ($action === 'get_role_permissions') {
        $roles = ['ceo','manager','hr','frontend_tl','frontend_employee','frontend_intern','backend_tl','backend_employee','backend_intern'];
        $result = $conn->query('SELECT role_key, permission_key FROM role_permissions ORDER BY role_key, permission_key');
        $permissions = array_fill_keys($roles, []);
        while ($row = $result->fetch_assoc()) $permissions[$row['role_key']][] = $row['permission_key'];
        echo json_encode(['success' => true, 'roles' => $permissions]);
    } elseif ($action === 'get_requests') {
        // Get all pending registration requests
        $stmt = $conn->prepare("SELECT * FROM registration_requests WHERE status = 'pending' ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();

        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }

        echo json_encode(['success' => true, 'requests' => $requests]);
        $stmt->close();
    } elseif ($action === 'get_all_requests') {
        // Get all registration requests
        $stmt = $conn->prepare("SELECT * FROM registration_requests ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();

        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }

        echo json_encode(['success' => true, 'requests' => $requests]);
        $stmt->close();
    } elseif ($action === 'get_employees') {
        // Get all approved employees
        $stmt = $conn->prepare("SELECT e.*, u.phone FROM employees e LEFT JOIN users u ON e.user_id = u.id WHERE e.status = 'approved' ORDER BY e.created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();

        $employees = [];
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }

        echo json_encode(['success' => true, 'employees' => $employees]);
        $stmt->close();
    } elseif ($action === 'get_attendance') {
        // Get every session in the selected date range.
        $from_date = $_GET['from_date'] ?? ($_GET['date'] ?? date('Y-m-d'));
        $to_date = $_GET['to_date'] ?? $from_date;
        $stmt = $conn->prepare("SELECT a.*, e.full_name, e.department, e.designation FROM attendance a JOIN employees e ON a.employee_id = e.id WHERE a.date BETWEEN ? AND ? ORDER BY a.date DESC, a.check_in_time DESC");
        $stmt->bind_param("ss", $from_date, $to_date);
        $stmt->execute();
        $result = $stmt->get_result();

        $attendance = [];
        while ($row = $result->fetch_assoc()) {
            $attendance[] = $row;
        }

        echo json_encode(['success' => true, 'attendance' => $attendance]);
        $stmt->close();
    } elseif ($action === 'get_dashboard_stats') {
        // Get dashboard statistics
        $stats = [];

        // Total employees
        $result = $conn->query("SELECT COUNT(*) as count FROM employees WHERE status = 'approved'");
        $stats['total_employees'] = $result->fetch_assoc()['count'];

        // Pending requests
        $result = $conn->query("SELECT COUNT(*) as count FROM registration_requests WHERE status = 'pending'");
        $stats['pending_requests'] = $result->fetch_assoc()['count'];

        // Present today
        $today = date('Y-m-d');
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status = 'present'");
        $stmt->bind_param("s", $today);
        $stmt->execute();
        $stats['present_today'] = $stmt->get_result()->fetch_assoc()['count'];
        $stmt->close();

        // Absent today
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM employees WHERE status = 'approved' AND id NOT IN (SELECT employee_id FROM attendance WHERE date = ?)");
        $stmt->bind_param("s", $today);
        $stmt->execute();
        $stats['absent_today'] = $stmt->get_result()->fetch_assoc()['count'];
        $stmt->close();

        echo json_encode(['success' => true, 'stats' => $stats]);
    } elseif ($action === 'get_dashboard_analytics') {
        $analytics = [];

        $result = $conn->query("SELECT department, COUNT(*) AS count FROM employees WHERE status = 'approved' GROUP BY department ORDER BY count DESC");
        $analytics['departments'] = [];
        while ($row = $result->fetch_assoc()) {
            $analytics['departments'][] = ['label' => $row['department'] ?: 'Unassigned', 'value' => (int)$row['count']];
        }

        $result = $conn->query("SELECT status, COUNT(*) AS count FROM projects GROUP BY status ORDER BY count DESC");
        $analytics['projects'] = [];
        while ($row = $result->fetch_assoc()) {
            $analytics['projects'][] = ['label' => $row['status'], 'value' => (int)$row['count']];
        }

        $analytics['employee_growth'] = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = date('Y-m', strtotime("-$i months"));
            $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM employees WHERE status = 'approved' AND DATE_FORMAT(created_at, '%Y-%m') = ?");
            $stmt->bind_param('s', $month);
            $stmt->execute();
            $count = $stmt->get_result()->fetch_assoc()['count'];
            $stmt->close();
            $analytics['employee_growth'][] = ['label' => date('M', strtotime($month . '-01')), 'value' => (int)$count];
        }

        $analytics['attendance'] = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM attendance WHERE date = ? AND status = 'present'");
            $stmt->bind_param('s', $date);
            $stmt->execute();
            $present = $stmt->get_result()->fetch_assoc()['count'];
            $stmt->close();
            $analytics['attendance'][] = ['label' => date('D', strtotime($date)), 'value' => (int)$present];
        }

        echo json_encode(['success' => true, 'analytics' => $analytics]);
    } elseif ($action === 'get_employee_details') {
        // Get single employee details - ALL fields
        $employee_id = $_GET['employee_id'] ?? '';
        
        if (empty($employee_id)) {
            echo json_encode(['success' => false, 'message' => 'Employee ID is required']);
            exit;
        }
        
        $stmt = $conn->prepare("SELECT e.*, u.phone, u.id as user_id FROM employees e LEFT JOIN users u ON e.user_id = u.id WHERE e.id = ?");
        $stmt->bind_param("i", $employee_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Employee not found']);
            exit;
        }
        
        $employee = $result->fetch_assoc();
        echo json_encode(['success' => true, 'employee' => $employee]);
        $stmt->close();
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $json_input = file_get_contents('php://input');
        $data = json_decode($json_input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('JSON decode error: ' . json_last_error_msg());
            echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
            exit;
        }

        if (!$data || !isset($data['action'])) {
            echo json_encode(['success' => false, 'message' => 'Invalid request data']);
            exit;
        }

        $action = $data['action'];
    $permissionMap = ['approve_request' => 'requests.update', 'reject_request' => 'requests.update', 'add_employee' => 'employees.create', 'update_employee' => 'employees.update', 'delete_employee' => 'employees.delete', 'create_attendance' => 'attendance.create', 'update_attendance' => 'attendance.update', 'delete_attendance' => 'attendance.delete', 'create_leave' => 'leaves.create', 'update_leave' => 'leaves.update', 'delete_leave' => 'leaves.delete', 'create_note' => 'notes.create', 'update_note' => 'notes.update', 'delete_note' => 'notes.delete', 'create_notification' => 'notifications.create', 'update_notification' => 'notifications.update', 'delete_notification' => 'notifications.delete', 'create_task' => 'tasks.create', 'update_task' => 'tasks.update', 'delete_task' => 'tasks.delete'];
    
    // Special handling for save_role_permissions - only admin can access
    if ($action === 'save_role_permissions') {
        if (($_SESSION['role'] ?? '') !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }
        
        error_log('save_role_permissions called');
        $role = $data['role'] ?? '';
        $permissions = $data['permissions'] ?? [];
        error_log('Role: ' . $role . ', Permissions: ' . json_encode($permissions));
        
        $validRoles = ['ceo','manager','hr','frontend_tl','frontend_employee','frontend_intern','backend_tl','backend_employee','backend_intern'];
        $validPermissions = ['*','dashboard.view','projects.read','projects.create','projects.update','projects.delete','revenue.read','revenue.create','revenue.update','revenue.delete','employees.read','employees.create','employees.update','employees.delete','requests.read','requests.update','attendance.read','attendance.self','attendance.create','attendance.update','attendance.delete','attendance_logs.read','work_updates.read','leaves.read','leaves.self','leaves.create','leaves.update','leaves.delete','notes.self','notes.read','notes.create','notes.update','notes.delete','profile.self','notifications.self','notifications.read','notifications.create','notifications.update','notifications.delete','tasks.read','tasks.create','tasks.update','tasks.delete','roles.manage'];
        
        if (!in_array($role, $validRoles, true)) {
            error_log('Invalid role: ' . $role);
            echo json_encode(['success' => false, 'message' => 'Invalid role']);
            exit;
        }
        
        if (!is_array($permissions)) {
            error_log('Permissions not an array');
            echo json_encode(['success' => false, 'message' => 'Permissions must be an array']);
            exit;
        }
        
        $invalidPermissions = array_diff($permissions, $validPermissions);
        if (!empty($invalidPermissions)) {
            error_log('Invalid permissions: ' . implode(', ', $invalidPermissions));
            echo json_encode(['success' => false, 'message' => 'Invalid permissions: ' . implode(', ', $invalidPermissions)]);
            exit;
        }
        
        error_log('Validation passed, starting database operations');
        
        try {
            $conn->begin_transaction();
            error_log('Transaction started');
            
            $delete = $conn->prepare('DELETE FROM role_permissions WHERE role_key = ?');
            if (!$delete) {
                throw new Exception('Prepare delete failed: ' . $conn->error);
            }
            $delete->bind_param('s', $role);
            if (!$delete->execute()) {
                throw new Exception('Delete execute failed: ' . $delete->error);
            }
            $delete->close();
            error_log('Delete completed');
            
            if (!empty($permissions)) {
                $insert = $conn->prepare('INSERT INTO role_permissions (role_key, permission_key) VALUES (?, ?)');
                if (!$insert) {
                    throw new Exception('Prepare insert failed: ' . $conn->error);
                }
                
                foreach (array_unique($permissions) as $permission) {
                    $insert->bind_param('ss', $role, $permission);
                    if (!$insert->execute()) {
                        throw new Exception('Insert execute failed for ' . $permission . ': ' . $insert->error);
                    }
                }
                $insert->close();
                error_log('Insert completed');
            }
            
            $conn->commit();
            error_log('Transaction committed');
            echo json_encode(['success' => true, 'message' => 'Permissions saved. The role takes effect on next login.']);
            exit; // Important: exit after processing
        } catch (Exception $e) {
            error_log('Exception in save_role_permissions: ' . $e->getMessage());
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Error saving permissions: ' . $e->getMessage()]);
            exit;
        }
    } else if (isset($permissionMap[$action])) {
        require_permission($conn, $permissionMap[$action]);
    }
    
    if ($action === 'update_admin_profile') {
        if (($_SESSION['role'] ?? '') !== 'admin') { http_response_code(403); echo json_encode(['success' => false, 'message' => 'Admin access required']); exit; }
        $admin_id = (int)($data['admin_id'] ?? 0);
        $phone = trim($data['phone'] ?? '');
        if (!preg_match('/^[0-9]{10}$/', $phone)) {
            echo json_encode(['success' => false, 'message' => 'Phone number must be 10 digits']);
            exit;
        }
        $stmt = $conn->prepare("UPDATE users SET phone = ? WHERE id = ? AND role = 'admin'");
        $stmt->bind_param('si', $phone, $admin_id);
        echo json_encode($stmt->execute() ? ['success' => true, 'message' => 'Profile updated successfully'] : ['success' => false, 'message' => 'Could not update profile']);
        $stmt->close();
    } elseif ($action === 'save_role_permissions') {
        $role = $data['role'] ?? '';
        $permissions = $data['permissions'] ?? [];
        $validRoles = ['ceo','manager','hr','frontend_tl','frontend_employee','frontend_intern','backend_tl','backend_employee','backend_intern'];
        $validPermissions = ['*','dashboard.view','projects.read','projects.create','projects.update','projects.delete','revenue.read','revenue.create','revenue.update','revenue.delete','employees.read','employees.create','employees.update','employees.delete','requests.read','requests.update','attendance.read','attendance.self','attendance.create','attendance.update','attendance.delete','attendance_logs.read','work_updates.read','leaves.read','leaves.self','leaves.create','leaves.update','leaves.delete','notes.self','notes.read','notes.create','notes.update','notes.delete','profile.self','notifications.self','notifications.read','notifications.create','notifications.update','notifications.delete','tasks.read','tasks.create','tasks.update','tasks.delete','roles.manage'];
        
        if (!in_array($role, $validRoles, true)) {
            echo json_encode(['success' => false, 'message' => 'Invalid role']);
            exit;
        }
        
        if (!is_array($permissions)) {
            echo json_encode(['success' => false, 'message' => 'Permissions must be an array']);
            exit;
        }
        
        $invalidPermissions = array_diff($permissions, $validPermissions);
        if (!empty($invalidPermissions)) {
            echo json_encode(['success' => false, 'message' => 'Invalid permissions: ' . implode(', ', $invalidPermissions)]);
            exit;
        }
        
        try {
            $conn->begin_transaction();
            $delete = $conn->prepare('DELETE FROM role_permissions WHERE role_key = ?');
            $delete->bind_param('s', $role);
            $delete->execute();
            $delete->close();
            
            if (!empty($permissions)) {
                $insert = $conn->prepare('INSERT INTO role_permissions (role_key, permission_key) VALUES (?, ?)');
                foreach (array_unique($permissions) as $permission) {
                    $insert->bind_param('ss', $role, $permission);
                    if (!$insert->execute()) {
                        throw new Exception('Could not save permission: ' . $permission);
                    }
                }
                $insert->close();
            }
            
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Permissions saved. The role takes effect on next login.']);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Error saving permissions: ' . $e->getMessage()]);
        }
    } elseif ($action === 'approve_request') {
        error_log("Starting approve_request");
        $request_id = $data['request_id'] ?? '';
        $employee_code = trim($data['employee_code'] ?? '');
        $admin_notes = $data['admin_notes'] ?? '';

        error_log("Request ID: $request_id, Employee Code: $employee_code");

        if (empty($request_id)) {
            echo json_encode(['success' => false, 'message' => 'Request ID is required']);
            exit;
        }

        if (!preg_match('/^[A-Za-z0-9_-]{3,50}$/', $employee_code)) {
            echo json_encode(['success' => false, 'message' => 'A valid Employee ID is required']);
            exit;
        }

        error_log("Checking for duplicate employee code");
        $code_stmt = $conn->prepare("SELECT id FROM employees WHERE employee_code = ?");
        $code_stmt->bind_param("s", $employee_code);
        $code_stmt->execute();
        if ($code_stmt->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'This Employee ID is already assigned']);
            exit;
        }
        $code_stmt->close();

        error_log("Getting request details");
        // Get request details
        $stmt = $conn->prepare("SELECT * FROM registration_requests WHERE id = ?");
        $stmt->bind_param("i", $request_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Request not found']);
            exit;
        }

        $request = $result->fetch_assoc();
        error_log("Request data: " . print_r($request, true));

        if ($request['status'] !== 'pending') {
            echo json_encode(['success' => false, 'message' => 'Only pending requests can be approved']);
            exit;
        }

        error_log("Checking for duplicates");
        $duplicate_stmt = $conn->prepare("SELECT full_name FROM employees WHERE phone = ? OR email = ? LIMIT 1");
        $duplicate_stmt->bind_param("ss", $request['phone'], $request['email']);
        $duplicate_stmt->execute();
        $duplicate_result = $duplicate_stmt->get_result();
        if ($duplicate_result->num_rows > 0) {
            $duplicate_employee = $duplicate_result->fetch_assoc();
            echo json_encode([
                'success' => false,
                'message' => 'Cannot approve: this phone number or email is already assigned to ' . $duplicate_employee['full_name']
            ]);
            exit;
        }
        $duplicate_stmt->close();
        
        error_log("Starting transaction");
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        // Keep the request status and employee record in sync.
        $conn->begin_transaction();
        $update_stmt = $conn->prepare("UPDATE registration_requests SET status = 'approved', admin_notes = ? WHERE id = ?");
        $update_stmt->bind_param("si", $admin_notes, $request_id);

        if ($update_stmt->execute()) {
            $user_id = (int)($request['employee_id'] ?? 0);
            error_log("Debug: user_id from request = " . $user_id);
            error_log("Debug: request data = " . print_r($request, true));
            
            if ($user_id <= 0) {
                // Try to find user by phone number
                $user_stmt = $conn->prepare("SELECT id FROM users WHERE phone = ? LIMIT 1");
                $user_stmt->bind_param("s", $request['phone']);
                $user_stmt->execute();
                $user_result = $user_stmt->get_result();
                if ($user_result->num_rows > 0) {
                    $user_row = $user_result->fetch_assoc();
                    $user_id = (int)$user_row['id'];
                    error_log("Debug: Found user_id by phone: " . $user_id);
                } else {
                    $conn->rollback();
                    echo json_encode(['success' => false, 'message' => 'Employee user record not found. Please ensure the user has registered.']);
                    exit;
                }
                $user_stmt->close();
            }

            $emp_stmt = $conn->prepare("INSERT INTO employees (user_id, employee_code, full_name, email, phone, photo, signature, position, nda_accepted, nda_record, nda_agreement_id, nda_version, nda_ip, date_of_birth, gender, address, city, state, pincode, department, designation, higher_education, experience_level, company_name, company_contact, aadhaar_front, aadhaar_back, pan_front, education_docs, experience_letter, pay_slip, offer_letter, age, blood_group, aadhaar_number, pan_number, emergency_contact_name, emergency_contact_relationship, emergency_contact_number, door_number, street, area_locality, district, password, joining_date, salary, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            if (!$emp_stmt) {
                $conn->rollback();
                echo json_encode(['success' => false, 'message' => 'Prepare Error: ' . $conn->error]);
                exit;
            }

            $salary = isset($request['expected_salary']) && $request['expected_salary'] ? floatval($request['expected_salary']) : 0;
            $age = isset($request['age']) && $request['age'] ? intval($request['age']) : 0;
            $nda_accepted = intval($request['nda_accepted'] ?? 0);
            $status = 'approved';
            $employee_code = trim((string)($employee_code ?? ''));
            $full_name = (string)($request['full_name'] ?? '');
            $email = (string)($request['email'] ?? '');
            $phone = (string)($request['phone'] ?? '');
            $photo = (string)($request['photo'] ?? '');
            $signature = (string)($request['signature'] ?? '');
            $position = (string)($request['position'] ?? '');
            $nda_record = $request['nda_record'] ?? null;
            $nda_agreement_id = $request['nda_agreement_id'] ?? null;
            $nda_version = $request['nda_version'] ?? null;
            $nda_ip = $request['nda_ip'] ?? null;
            $date_of_birth = $request['date_of_birth'] ?? null;
            $gender = (string)($request['gender'] ?? '');
            $address = (string)($request['address'] ?? '');
            $city = (string)($request['city'] ?? '');
            $state = (string)($request['state'] ?? '');
            $pincode = (string)($request['pincode'] ?? '');
            $department = (string)($request['department'] ?? '');
            $designation = (string)($request['designation'] ?? '');
            $higher_education = (string)($request['higher_education'] ?? '');
            $experience_level = (string)($request['experience_level'] ?? '');
            $company_name = (string)($request['company_name'] ?? '');
            $company_contact = (string)($request['company_contact'] ?? '');
            $aadhaar_front = (string)($request['aadhaar_front'] ?? '');
            $aadhaar_back = (string)($request['aadhaar_back'] ?? '');
            $pan_front = (string)($request['pan_front'] ?? '');
            $education_docs = (string)($request['education_docs'] ?? '');
            $experience_letter = (string)($request['experience_letter'] ?? '');
            $pay_slip = (string)($request['pay_slip'] ?? '');
            $offer_letter = (string)($request['offer_letter'] ?? '');
            $blood_group = (string)($request['blood_group'] ?? '');
            $aadhaar_number = (string)($request['aadhaar_number'] ?? '');
            $pan_number = (string)($request['pan_number'] ?? '');
            $emergency_contact_name = (string)($request['emergency_contact_name'] ?? '');
            $emergency_contact_relationship = (string)($request['emergency_contact_relationship'] ?? '');
            $emergency_contact_number = (string)($request['emergency_contact_number'] ?? '');
            $door_number = (string)($request['door_number'] ?? '');
            $street = (string)($request['street'] ?? '');
            $area_locality = (string)($request['area_locality'] ?? '');
            $district = (string)($request['district'] ?? '');
            $password = (string)($request['password'] ?? '');
            $joining_date = date('Y-m-d');

            $bind_params = [
                $user_id,
                $employee_code,
                $full_name,
                $email,
                $phone,
                $photo,
                $signature,
                $position,
                $nda_accepted,
                $nda_record,
                $nda_agreement_id,
                $nda_version,
                $nda_ip,
                $date_of_birth,
                $gender,
                $address,
                $city,
                $state,
                $pincode,
                $department,
                $designation,
                $higher_education,
                $experience_level,
                $company_name,
                $company_contact,
                $aadhaar_front,
                $aadhaar_back,
                $pan_front,
                $education_docs,
                $experience_letter,
                $pay_slip,
                $offer_letter,
                $age,
                $blood_group,
                $aadhaar_number,
                $pan_number,
                $emergency_contact_name,
                $emergency_contact_relationship,
                $emergency_contact_number,
                $door_number,
                $street,
                $area_locality,
                $district,
                $password,
                $joining_date,
                $salary,
                $status,
                date('Y-m-d H:i:s'),
                date('Y-m-d H:i:s')
            ];

            $types = '';
            foreach ($bind_params as $value) {
                if ($value === null) {
                    $types .= 's';
                } elseif (is_int($value)) {
                    $types .= 'i';
                } elseif (is_float($value) || is_double($value)) {
                    $types .= 'd';
                } else {
                    $types .= 's';
                }
            }

            try {
                $emp_stmt->bind_param($types, ...$bind_params);
                $employee_created = $emp_stmt->execute();
            } catch (mysqli_sql_exception $e) {
                $conn->rollback();
                echo json_encode(['success' => false, 'message' => 'Could not approve this request: ' . $e->getMessage()]);
                $emp_stmt->close();
                exit;
            }

            if ($employee_created) {
                $conn->commit();
                
                // Send emails but don't fail if it errors
                $email_sent = false;
                $email_error = '';
                try {
                    require_once 'email-functions.php';
                    $result1 = send_approval_to_employee($request['full_name'], $request['email'], $employee_code, $password);
                    $result2 = send_approval_notification_to_admin($request['full_name'], $request['email'], $employee_code, $department);
                    $email_sent = ($result1['success'] && $result2['success']);
                    if (!$email_sent) {
                        $email_error = $result1['message'] ?? $result2['message'] ?? 'Email sending partially failed';
                    }
                } catch (Exception $e) {
                    $email_error = $e->getMessage();
                    error_log("Email sending failed: " . $e->getMessage());
                }

                $message = $email_sent 
                    ? 'Employee approved successfully and emails sent to both employee and admin.' 
                    : 'Employee approved successfully. Note: ' . $email_error;
                
                echo json_encode(['success' => true, 'message' => $message, 'email_sent' => $email_sent]);
            } else {
                $conn->rollback();
                echo json_encode(['success' => false, 'message' => 'Failed to create employee record']);
            }

            $emp_stmt->close();
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to update request']);
        }

        $update_stmt->close();
        $stmt->close();
    } elseif ($action === 'reject_request') {
        $request_id = $data['request_id'] ?? '';
        $admin_notes = $data['admin_notes'] ?? '';

        if (empty($request_id)) {
            echo json_encode(['success' => false, 'message' => 'Request ID is required']);
            exit;
        }

        // Get request details
        $stmt = $conn->prepare("SELECT * FROM registration_requests WHERE id = ?");
        $stmt->bind_param("i", $request_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Request not found']);
            exit;
        }

        $request = $result->fetch_assoc();

        // Update request status
        $update_stmt = $conn->prepare("UPDATE registration_requests SET status = 'rejected', admin_notes = ? WHERE id = ?");
        $update_stmt->bind_param("si", $admin_notes, $request_id);

        if ($update_stmt->execute()) {
            // Send rejection email but don't fail if it errors
            $email_sent = false;
            $email_error = '';
            try {
                require_once 'email-functions.php';
                $rejection_reason = trim($admin_notes !== '' ? $admin_notes : 'Your registration did not meet the required criteria.');
                $result = send_rejection_to_employee($request['full_name'], $request['email'], $rejection_reason);
                $email_sent = $result['success'];
                if (!$email_sent) {
                    $email_error = $result['message'] ?? 'Email sending failed';
                }
            } catch (Exception $e) {
                $email_error = $e->getMessage();
                error_log("Email sending failed: " . $e->getMessage());
            }

            $message = $email_sent 
                ? 'Request rejected successfully and email sent to employee.' 
                : 'Request rejected successfully. Note: ' . $email_error;
            
            echo json_encode(['success' => true, 'message' => $message, 'email_sent' => $email_sent]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update request']);
        }

        $update_stmt->close();
        $stmt->close();
    } elseif ($action === 'add_employee') {
        // Add new employee directly
        $full_name = $data['full_name'] ?? '';
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $password = $data['password'] ?? '';
        $department = $data['department'] ?? '';
        $designation = $data['designation'] ?? '';
        $salary = $data['salary'] ?? null;
        $joining_date = $data['joining_date'] ?? null;
        $date_of_birth = $data['date_of_birth'] ?? null;
        $gender = $data['gender'] ?? null;
        $address = $data['address'] ?? null;
        $city = $data['city'] ?? null;
        $state = $data['state'] ?? null;
        $pincode = $data['pincode'] ?? null;
        $status = $data['status'] ?? 'active';
        
        if (empty($full_name) || empty($email) || empty($phone) || empty($password) || empty($department) || empty($designation)) {
            echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
            exit;
        }
        
        // Check if email already exists
        $check_email = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check_email->bind_param("s", $email);
        $check_email->execute();
        if ($check_email->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
            exit;
        }
        $check_email->close();
        
        // Check if phone already exists
        $check_phone = $conn->prepare("SELECT id FROM users WHERE phone = ?");
        $check_phone->bind_param("s", $phone);
        $check_phone->execute();
        if ($check_phone->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Phone number already exists']);
            exit;
        }
        $check_phone->close();
        
        $conn->begin_transaction();
        
        // Generate employee code
        $employee_code = 'EMP' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        // Create user record
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $user_stmt = $conn->prepare("INSERT INTO users (email, phone, password, role) VALUES (?, ?, ?, 'employee')");
        $user_stmt->bind_param("sss", $email, $phone, $hashed_password);
        
        if (!$user_stmt->execute()) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to create user record']);
            exit;
        }
        
        $user_id = $conn->insert_id;
        $user_stmt->close();
        
        // Create employee record
        $emp_stmt = $conn->prepare("INSERT INTO employees (user_id, full_name, email, phone, employee_code, department, designation, salary, joining_date, date_of_birth, gender, address, city, state, pincode, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $emp_stmt->bind_param("issssssssssssss", $user_id, $full_name, $email, $phone, $employee_code, $department, $designation, $salary, $joining_date, $date_of_birth, $gender, $address, $city, $state, $pincode, $status);
        
        if ($emp_stmt->execute()) {
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Employee added successfully']);
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to create employee record']);
        }
        $emp_stmt->close();
        
    } elseif ($action === 'update_employee') {
        // Update existing employee
        $employee_id = $data['employee_id'] ?? '';
        $full_name = $data['full_name'] ?? '';
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $department = $data['department'] ?? '';
        $designation = $data['designation'] ?? '';
        $salary = $data['salary'] ?? null;
        $joining_date = $data['joining_date'] ?? null;
        $date_of_birth = $data['date_of_birth'] ?? null;
        $gender = $data['gender'] ?? null;
        $address = $data['address'] ?? null;
        $city = $data['city'] ?? null;
        $state = $data['state'] ?? null;
        $pincode = $data['pincode'] ?? null;
        $status = $data['status'] ?? 'active';
        
        if (empty($employee_id) || empty($full_name) || empty($email) || empty($phone) || empty($department) || empty($designation)) {
            echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
            exit;
        }
        
        // Get employee user_id
        $emp_stmt = $conn->prepare("SELECT user_id FROM employees WHERE id = ?");
        $emp_stmt->bind_param("i", $employee_id);
        $emp_stmt->execute();
        $emp_result = $emp_stmt->get_result();
        $employee = $emp_result->fetch_assoc();
        $emp_stmt->close();
        
        if (!$employee) {
            echo json_encode(['success' => false, 'message' => 'Employee not found']);
            exit;
        }
        
        $conn->begin_transaction();
        
        // Update user record
        $user_stmt = $conn->prepare("UPDATE users SET email = ?, phone = ? WHERE id = ?");
        $user_stmt->bind_param("ssi", $email, $phone, $employee['user_id']);
        
        if (!$user_stmt->execute()) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to update user record']);
            exit;
        }
        $user_stmt->close();
        
        // Update employee record
        $emp_update_stmt = $conn->prepare("UPDATE employees SET full_name = ?, department = ?, designation = ?, salary = ?, joining_date = ?, date_of_birth = ?, gender = ?, address = ?, city = ?, state = ?, pincode = ?, status = ? WHERE id = ?");
        $emp_update_stmt->bind_param("ssssssssssssi", $full_name, $department, $designation, $salary, $joining_date, $date_of_birth, $gender, $address, $city, $state, $pincode, $status, $employee_id);
        
        if ($emp_update_stmt->execute()) {
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Employee updated successfully']);
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to update employee record']);
        }
        $emp_update_stmt->close();
        
    } elseif ($action === 'delete_employee') {
        // Delete employee
        $employee_id = $data['employee_id'] ?? '';
        
        if (empty($employee_id)) {
            echo json_encode(['success' => false, 'message' => 'Employee ID is required']);
            exit;
        }
        
        // Get employee user_id
        $emp_stmt = $conn->prepare("SELECT user_id FROM employees WHERE id = ?");
        $emp_stmt->bind_param("i", $employee_id);
        $emp_stmt->execute();
        $emp_result = $emp_stmt->get_result();
        $employee = $emp_result->fetch_assoc();
        $emp_stmt->close();
        
        if (!$employee) {
            echo json_encode(['success' => false, 'message' => 'Employee not found']);
            exit;
        }
        
        $conn->begin_transaction();
        
        // Delete employee record
        $delete_emp = $conn->prepare("DELETE FROM employees WHERE id = ?");
        $delete_emp->bind_param("i", $employee_id);
        
        if (!$delete_emp->execute()) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to delete employee record']);
            exit;
        }
        $delete_emp->close();
        
        // Delete user record
        $delete_user = $conn->prepare("DELETE FROM users WHERE id = ?");
        $delete_user->bind_param("i", $employee['user_id']);
        
        if ($delete_user->execute()) {
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Employee deleted successfully']);
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to delete user record']);
        }
        $delete_user->close();
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
    } catch (Exception $e) {
        error_log('POST Error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
