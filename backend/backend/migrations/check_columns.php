<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "Checking registration_requests table columns:\n";
$result = $conn->query("SHOW COLUMNS FROM registration_requests LIKE 'signature'");
echo "signature: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

$result = $conn->query("SHOW COLUMNS FROM registration_requests LIKE 'position'");
echo "position: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

$result = $conn->query("SHOW COLUMNS FROM registration_requests LIKE 'nda_acceptance'");
echo "nda_acceptance: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

$result = $conn->query("SHOW COLUMNS FROM registration_requests LIKE 'password'");
echo "password: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

echo "\nChecking employees table columns:\n";
$result = $conn->query("SHOW COLUMNS FROM employees LIKE 'signature'");
echo "signature: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

$result = $conn->query("SHOW COLUMNS FROM employees LIKE 'position'");
echo "position: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

$result = $conn->query("SHOW COLUMNS FROM employees LIKE 'nda_acceptance'");
echo "nda_acceptance: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

$result = $conn->query("SHOW COLUMNS FROM employees LIKE 'password'");
echo "password: " . ($result->num_rows > 0 ? "EXISTS" : "MISSING") . "\n";

$conn->close();
?>
