<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "Testing approval process...\n\n";

// Get a pending request
$stmt = $conn->prepare("SELECT * FROM registration_requests WHERE status = 'pending' LIMIT 1");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "No pending requests found\n";
    exit;
}

$request = $result->fetch_assoc();
echo "Found request ID: " . $request['id'] . "\n";
echo "Employee ID: " . $request['employee_id'] . "\n";
echo "Full name: " . $request['full_name'] . "\n";
echo "Email: " . $request['email'] . "\n";
echo "Phone: " . $request['phone'] . "\n";

// Check if employee_id is null
if ($request['employee_id'] === null) {
    echo "\nERROR: employee_id is NULL in registration_requests\n";
    echo "This will cause the approval to fail\n";
}

// Check required fields
$required_fields = ['full_name', 'email', 'phone', 'photo', 'signature', 'position'];
foreach ($required_fields as $field) {
    if (empty($request[$field])) {
        echo "\nWARNING: $field is empty or missing\n";
    }
}

echo "\nAll required fields check completed.\n";

$stmt->close();
$conn->close();
?>
