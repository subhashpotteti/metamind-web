<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "Adding columns to employees table...\n\n";

$employee_queries = [
    "ALTER TABLE employees ADD COLUMN signature VARCHAR(255) DEFAULT NULL AFTER offer_letter",
    "ALTER TABLE employees ADD COLUMN position VARCHAR(50) DEFAULT NULL AFTER signature",
    "ALTER TABLE employees ADD COLUMN nda_acceptance TEXT DEFAULT NULL AFTER position",
    "ALTER TABLE employees ADD COLUMN password VARCHAR(255) DEFAULT NULL AFTER nda_acceptance"
];

foreach ($employee_queries as $query) {
    $result = $conn->query($query);
    if ($result) {
        echo "SUCCESS: " . $query . "\n";
    } else {
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
