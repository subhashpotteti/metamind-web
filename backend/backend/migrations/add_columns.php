<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "Database connection: " . ($conn->connect_error ? "FAILED - " . $conn->connect_error : "SUCCESS") . "\n\n";

// Add columns to registration_requests table
$registration_queries = [
    "ALTER TABLE registration_requests ADD COLUMN signature VARCHAR(255) DEFAULT NULL AFTER offer_letter",
    "ALTER TABLE registration_requests ADD COLUMN position VARCHAR(50) DEFAULT NULL AFTER signature", 
    "ALTER TABLE registration_requests ADD COLUMN nda_acceptance TEXT DEFAULT NULL AFTER position",
    "ALTER TABLE registration_requests ADD COLUMN password VARCHAR(255) DEFAULT NULL AFTER nda_acceptance"
];

// Add columns to employees table
$employee_queries = [
    "ALTER TABLE employees ADD COLUMN signature VARCHAR(255) DEFAULT NULL AFTER offer_letter",
    "ALTER TABLE employees ADD COLUMN position VARCHAR(50) DEFAULT NULL AFTER signature",
    "ALTER TABLE employees ADD COLUMN nda_acceptance TEXT DEFAULT NULL AFTER position",
    "ALTER TABLE employees ADD COLUMN password VARCHAR(255) DEFAULT NULL AFTER nda_acceptance"
];

$all_queries = array_merge($registration_queries, $employee_queries);

foreach ($all_queries as $query) {
    $result = $conn->query($query);
    if ($result) {
        echo "SUCCESS: " . $query . "\n";
    } else {
        // Check if error is about duplicate column (column already exists)
        if (strpos($conn->error, 'Duplicate column name') !== false) {
            echo "SKIP: Column already exists - " . $query . "\n";
        } else {
            echo "ERROR: " . $conn->error . " - " . $query . "\n";
        }
    }
}

$conn->close();
echo "\nMigration completed.\n";
?>
