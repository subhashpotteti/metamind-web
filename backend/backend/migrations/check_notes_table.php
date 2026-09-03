<?php
require_once '../config/database.php';

// Check if notes table exists
$check = $conn->query("SHOW TABLES LIKE 'notes'");
if ($check->num_rows > 0) {
    echo "Notes table exists.\n";
    
    // Show table structure
    $result = $conn->query("DESCRIBE notes");
    echo "Table structure:\n";
    while ($row = $result->fetch_assoc()) {
        print_r($row);
    }
} else {
    echo "Notes table does NOT exist. Please run create_notes_table.sql\n";
}

// Check if there are any admin users
$adminCheck = $conn->query("SELECT id, full_name, role FROM users WHERE role = 'admin'");
echo "\nAdmin users:\n";
while ($row = $adminCheck->fetch_assoc()) {
    print_r($row);
}
?>
