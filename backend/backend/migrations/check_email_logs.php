<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "Checking if email_logs table exists:\n";
$result = $conn->query("SHOW TABLES LIKE 'email_logs'");
if ($result->num_rows > 0) {
    echo "email_logs table exists\n";
    $result = $conn->query("SHOW COLUMNS FROM email_logs");
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
} else {
    echo "email_logs table does not exist - creating it\n";
    $create_query = "CREATE TABLE IF NOT EXISTS email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        to_email VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        status ENUM('sent', 'failed') DEFAULT 'sent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    if ($conn->query($create_query)) {
        echo "email_logs table created successfully\n";
    } else {
        echo "Failed to create email_logs table: " . $conn->error . "\n";
    }
}

$conn->close();
?>
