<?php
require_once __DIR__ . '/../config/database.php';

$sql = "
-- Add new columns to registration_requests table
ALTER TABLE registration_requests 
ADD COLUMN IF NOT EXISTS higher_education VARCHAR(50) DEFAULT NULL AFTER designation,
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50) DEFAULT NULL AFTER higher_education,
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) DEFAULT NULL AFTER experience_level,
ADD COLUMN IF NOT EXISTS company_contact VARCHAR(20) DEFAULT NULL AFTER company_name,
ADD COLUMN IF NOT EXISTS aadhaar_front VARCHAR(255) DEFAULT NULL AFTER company_contact,
ADD COLUMN IF NOT EXISTS aadhaar_back VARCHAR(255) DEFAULT NULL AFTER aadhaar_front,
ADD COLUMN IF NOT EXISTS pan_front VARCHAR(255) DEFAULT NULL AFTER aadhaar_back,
ADD COLUMN IF NOT EXISTS education_docs TEXT DEFAULT NULL AFTER pan_front,
ADD COLUMN IF NOT EXISTS experience_letter VARCHAR(255) DEFAULT NULL AFTER education_docs,
ADD COLUMN IF NOT EXISTS pay_slip VARCHAR(255) DEFAULT NULL AFTER experience_letter,
ADD COLUMN IF NOT EXISTS offer_letter VARCHAR(255) DEFAULT NULL AFTER pay_slip;

ALTER TABLE registration_requests
ADD COLUMN IF NOT EXISTS signature VARCHAR(255) DEFAULT NULL AFTER photo,
ADD COLUMN IF NOT EXISTS position ENUM('employee', 'intern') DEFAULT 'employee' AFTER signature,
ADD COLUMN IF NOT EXISTS nda_accepted TINYINT(1) NOT NULL DEFAULT 0 AFTER position;

ALTER TABLE registration_requests
ADD COLUMN IF NOT EXISTS nda_record TEXT DEFAULT NULL AFTER nda_accepted,
ADD COLUMN IF NOT EXISTS nda_agreement_id VARCHAR(80) DEFAULT NULL AFTER nda_record,
ADD COLUMN IF NOT EXISTS nda_version VARCHAR(100) DEFAULT NULL AFTER nda_agreement_id,
ADD COLUMN IF NOT EXISTS nda_ip VARCHAR(45) DEFAULT NULL AFTER nda_version;

ALTER TABLE employees
ADD COLUMN IF NOT EXISTS signature VARCHAR(255) DEFAULT NULL AFTER photo,
ADD COLUMN IF NOT EXISTS position ENUM('employee', 'intern') DEFAULT 'employee' AFTER signature,
ADD COLUMN IF NOT EXISTS nda_accepted TINYINT(1) NOT NULL DEFAULT 0 AFTER position;

ALTER TABLE employees
ADD COLUMN IF NOT EXISTS nda_record TEXT DEFAULT NULL AFTER nda_accepted,
ADD COLUMN IF NOT EXISTS nda_agreement_id VARCHAR(80) DEFAULT NULL AFTER nda_record,
ADD COLUMN IF NOT EXISTS nda_version VARCHAR(100) DEFAULT NULL AFTER nda_agreement_id,
ADD COLUMN IF NOT EXISTS nda_ip VARCHAR(45) DEFAULT NULL AFTER nda_version;

-- Add new columns to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS higher_education VARCHAR(50) DEFAULT NULL AFTER designation,
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50) DEFAULT NULL AFTER higher_education,
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) DEFAULT NULL AFTER experience_level,
ADD COLUMN IF NOT EXISTS company_contact VARCHAR(20) DEFAULT NULL AFTER company_name,
ADD COLUMN IF NOT EXISTS aadhaar_front VARCHAR(255) DEFAULT NULL AFTER company_contact,
ADD COLUMN IF NOT EXISTS aadhaar_back VARCHAR(255) DEFAULT NULL AFTER aadhaar_front,
ADD COLUMN IF NOT EXISTS pan_front VARCHAR(255) DEFAULT NULL AFTER aadhaar_back,
ADD COLUMN IF NOT EXISTS education_docs TEXT DEFAULT NULL AFTER pan_front,
ADD COLUMN IF NOT EXISTS experience_letter VARCHAR(255) DEFAULT NULL AFTER education_docs,
ADD COLUMN IF NOT EXISTS pay_slip VARCHAR(255) DEFAULT NULL AFTER experience_letter,
ADD COLUMN IF NOT EXISTS offer_letter VARCHAR(255) DEFAULT NULL AFTER pay_slip;
";

// Split by semicolon and execute each statement
$statements = explode(';', $sql);
foreach ($statements as $statement) {
    $statement = trim($statement);
    if (!empty($statement)) {
        if ($conn->query($statement)) {
            echo "Success: " . substr($statement, 0, 50) . "...\n";
        } else {
            echo "Error: " . $conn->error . "\n";
        }
    }
}

$conn->close();
echo "Migration completed.\n";
?>
