<?php

error_reporting(0);
ini_set ('display_errors', 0);

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'metaminds-web');


header('Content-Type: application/json; charset=UTF-8');

mysqli_report(MYSQLI_REPORT_OFF);

$conn = new mysqli(
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME
);
date_default_timezone_set('Asia/Kolkata');
$conn->query("SET time_zone = '+05:30'");

if ($conn->connect_errno) {

    error_log(
        'MySQL connection failed: ' .
            $conn->connect_errno .
            ' - ' .
            $conn->connect_error
    );

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);

    exit;
}

if (!$conn->set_charset('utf8mb4')) {

    error_log(
        'MySQL charset failed: ' .
            $conn->error
    );

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Failed to set database charset'
    ]);

    exit;
}

function ensure_employee_code_column($conn)
{
    $check = $conn->query(
        "SHOW COLUMNS FROM employees LIKE 'employee_code'"
    );

    if ($check && $check->num_rows === 0) {

        $conn->query(
            "ALTER TABLE employees
             ADD COLUMN employee_code VARCHAR(50)
             NULL UNIQUE
             AFTER user_id"
        );

        $conn->query(
            "UPDATE employees
             SET employee_code = CONCAT(
                 'EMP-',
                 LPAD(id, 4, '0')
             )
             WHERE employee_code IS NULL
             OR employee_code = ''"
        );
    }

    if ($check) {
        $check->free();
    }
}
