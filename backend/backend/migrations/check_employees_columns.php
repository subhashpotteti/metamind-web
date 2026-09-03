<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "Checking employees table columns:\n";
$result = $conn->query("SHOW COLUMNS FROM employees");
while ($row = $result->fetch_assoc()) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}

echo "\nChecking registration_requests table columns:\n";
$result = $conn->query("SHOW COLUMNS FROM registration_requests");
while ($row = $result->fetch_assoc()) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}

$conn->close();
?>
