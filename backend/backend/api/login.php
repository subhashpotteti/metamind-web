<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../config/database.php';
// ensure_employee_code_column($conn);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $identifier = $data['identifier'] ?? '';
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? 'employee';

    // Validation
    if (empty($identifier) || empty($password)) {
        $message = $role === 'admin' ? 'Phone and password are required' : 'Employee ID and password are required';
        echo json_encode(['success' => false, 'message' => $message]);
        exit;
    }

    // Employees can log in with their assigned Employee ID or phone number.
    if ($role === 'employee') {
        $employeeCodeExists = $conn->query("SHOW COLUMNS FROM employees LIKE 'employee_code'");
        if ($employeeCodeExists && $employeeCodeExists->num_rows > 0) {
            $stmt = $conn->prepare("SELECT u.id, u.phone, u.password, u.role, e.employee_code FROM users u LEFT JOIN employees e ON u.id = e.user_id WHERE e.employee_code = ?");
            $stmt->bind_param("s", $identifier);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                $stmt->close();
                $stmt = $conn->prepare("SELECT id, phone, password, role FROM users WHERE phone = ?");
                $stmt->bind_param("s", $identifier);
                $stmt->execute();
                $result = $stmt->get_result();
            }
        } else {
            $stmt = $conn->prepare("SELECT id, phone, password, role FROM users WHERE phone = ?");
            $stmt->bind_param("s", $identifier);
            $stmt->execute();
            $result = $stmt->get_result();
        }
    } else {
        // For admin, use phone
        $stmt = $conn->prepare("SELECT id, phone, password, role FROM users WHERE phone = ? AND role = ?");
        $stmt->bind_param("ss", $identifier, $role);
        $stmt->execute();
        $result = $stmt->get_result();
    }

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        // An employee can only authenticate after an admin has approved the request.
        $employee_data = null;
        if ($user['role'] === 'employee') {
            $emp_stmt = $conn->prepare("SELECT * FROM employees WHERE user_id = ?");
            $emp_stmt->bind_param("i", $user['id']);
            $emp_stmt->execute();
            $emp_result = $emp_stmt->get_result();
            $employee = $emp_result->fetch_assoc();
            if ($employee && $employee['status'] === 'approved') {
                $employee_data = $employee;
            } else {
                $reg_stmt = $conn->prepare("SELECT status FROM registration_requests WHERE employee_id = ?");
                $reg_stmt->bind_param("i", $user['id']);
                $reg_stmt->execute();
                $reg_result = $reg_stmt->get_result();
                if ($reg_result->num_rows > 0) {
                    $request = $reg_result->fetch_assoc();
                    $message = $request['status'] === 'rejected'
                        ? 'Your registration has been rejected. Please contact admin.'
                        : 'Your registration is pending admin approval.';
                    echo json_encode(['success' => false, 'message' => $message, 'status' => $request['status']]);
                    exit;
                }
                echo json_encode(['success' => false, 'message' => 'Your employee account is not approved.']);
                exit;
            }
        }

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'phone' => $user['phone'],
                'role' => $user['role'],
                'employee_id' => $employee_data['employee_code'] ?? null
            ],
            'employee' => $employee_data
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
