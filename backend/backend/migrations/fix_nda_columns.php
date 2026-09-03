<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "Fixing NDA columns to match expected schema...\n\n";

// First, rename nda_acceptance to nda_accepted and add related columns for registration_requests
$registration_queries = [
    "ALTER TABLE registration_requests CHANGE COLUMN nda_acceptance nda_accepted TINYINT(1) NOT NULL DEFAULT 0",
    "ALTER TABLE registration_requests ADD COLUMN nda_record TEXT DEFAULT NULL AFTER nda_accepted",
    "ALTER TABLE registration_requests ADD COLUMN nda_agreement_id VARCHAR(80) DEFAULT NULL AFTER nda_record",
    "ALTER TABLE registration_requests ADD COLUMN nda_version VARCHAR(100) DEFAULT NULL AFTER nda_agreement_id",
    "ALTER TABLE registration_requests ADD COLUMN nda_ip VARCHAR(45) DEFAULT NULL AFTER nda_version"
];

// Same for employees table
$employee_queries = [
    "ALTER TABLE employees CHANGE COLUMN nda_acceptance nda_accepted TINYINT(1) NOT NULL DEFAULT 0",
    "ALTER TABLE employees ADD COLUMN nda_record TEXT DEFAULT NULL AFTER nda_accepted",
    "ALTER TABLE employees ADD COLUMN nda_agreement_id VARCHAR(80) DEFAULT NULL AFTER nda_record",
    "ALTER TABLE employees ADD COLUMN nda_version VARCHAR(100) DEFAULT NULL AFTER nda_agreement_id",
    "ALTER TABLE employees ADD COLUMN nda_ip VARCHAR(45) DEFAULT NULL AFTER nda_version"
];

$all_queries = array_merge($registration_queries, $employee_queries);

foreach ($all_queries as $query) {
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
