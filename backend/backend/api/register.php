<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
session_start();

try {
    require_once '../config/database.php';
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(['success' => false, 'message' => 'Invalid JSON data', 'json_error' => json_last_error_msg()]);
            exit;
        }
        
        // Extract fields
        $first_name = $data['first_name'] ?? '';
        $last_name = $data['last_name'] ?? '';
        $full_name = trim(($data['full_name'] ?? '') ?: ($first_name . ' ' . $last_name));
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $password = $data['password'] ?? '';
        $confirm_password = $data['confirm_password'] ?? '';
        $date_of_birth = $data['date_of_birth'] ?? '';
        $age = $data['age'] ?? '';
        $gender = $data['gender'] ?? '';
        $blood_group = $data['blood_group'] ?? '';
        $aadhaar_number = $data['aadhaar_number'] ?? '';
        $pan_number = $data['pan_number'] ?? '';
        $emergency_contact_name = $data['emergency_contact_name'] ?? '';
        $emergency_contact_relationship = $data['emergency_contact_relationship'] ?? '';
        $emergency_contact_number = $data['emergency_contact_number'] ?? '';
        $door_number = $data['door_number'] ?? '';
        $street = $data['street'] ?? '';
        $area_locality = $data['area_locality'] ?? '';
        $city = $data['city'] ?? '';
        $district = $data['district'] ?? '';
        $state = $data['state'] ?? '';
        $pincode = $data['pincode'] ?? '';
        $department = $data['department'] ?? '';
        $designation = $data['designation'] ?? '';
        $higher_education = $data['higher_education'] ?? '';
        $experience_level = $data['experience_level'] ?? '';
        $company_name = $data['company_name'] ?? '';
        $company_contact = $data['company_contact'] ?? '';
        $aadhaar_front = $data['aadhaar_front'] ?? '';
        $aadhaar_back = $data['aadhaar_back'] ?? '';
        $pan_front = $data['pan_front'] ?? '';
        $education_docs = $data['education_docs'] ?? [];
        $experience_letter = $data['experience_letter'] ?? '';
        $pay_slip = $data['pay_slip'] ?? '';
        $offer_letter = $data['offer_letter'] ?? '';
        $photo = $data['photo'] ?? '';
        $signature = $data['signature'] ?? '';
        $position = $data['position'] ?? '';
        $nda_accepted = $data['nda_accepted'] ?? false;
        $nda_record = $data['nda_record'] ?? null;
        
        $address = trim($door_number . ', ' . $street . ', ' . $area_locality . ', ' . $district . ', ' . $city . ', ' . $state . ' - ' . $pincode, ', ');
        
        // Validation
        $errors = [];
        
        if (empty($first_name)) $errors[] = 'First name is required';
        if (empty($last_name)) $errors[] = 'Last name is required';
        if (empty($email)) $errors[] = 'Email is required';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email format';
        if (empty($phone)) $errors[] = 'Phone is required';
        if (!preg_match('/^[0-9]{10}$/', $phone)) $errors[] = 'Invalid phone number format';
        if (empty($password)) $errors[] = 'Password is required';
        if (strlen($password) < 6) $errors[] = 'Password must be at least 6 characters';
        if ($password !== $confirm_password) $errors[] = 'Password and confirm password do not match';
        if (empty($date_of_birth)) $errors[] = 'Date of birth is required';
        if (empty($age)) $errors[] = 'Age is required';
        if (!is_numeric($age) || $age < 18 || $age > 65) $errors[] = 'Age must be between 18 and 65';
        if (empty($gender)) $errors[] = 'Gender is required';
        if (empty($blood_group)) $errors[] = 'Blood group is required';
        if (empty($emergency_contact_name)) $errors[] = 'Emergency contact name is required';
        if (empty($emergency_contact_relationship)) $errors[] = 'Emergency contact relationship is required';
        if (empty($emergency_contact_number)) $errors[] = 'Emergency contact number is required';
        if (!preg_match('/^[0-9]{10}$/', $emergency_contact_number)) $errors[] = 'Invalid emergency contact number';
        if (empty($door_number)) $errors[] = 'Door / house number is required';
        if (empty($street)) $errors[] = 'Street is required';
        if (empty($area_locality)) $errors[] = 'Area / locality is required';
        if (empty($city)) $errors[] = 'City is required';
        if (empty($district)) $errors[] = 'District is required';
        if (empty($state)) $errors[] = 'State is required';
        if (empty($pincode)) $errors[] = 'Pincode is required';
        if (!preg_match('/^[0-9]{6}$/', $pincode)) $errors[] = 'Pincode must be 6 digits';
        if (empty($department)) $errors[] = 'Department is required';
        if (empty($designation)) $errors[] = 'Designation is required';
        if (empty($higher_education)) $errors[] = 'Higher education is required';
        if (empty($experience_level)) $errors[] = 'Experience level is required';
        if (empty($aadhaar_front)) $errors[] = 'Aadhaar front is required';
        if (empty($aadhaar_back)) $errors[] = 'Aadhaar back is required';
        if (empty($pan_front)) $errors[] = 'PAN front is required';
        if (empty($photo)) $errors[] = 'Photo is required';
        if (empty($signature)) $errors[] = 'Signature is required';
        if (!in_array($position, ['employee', 'intern'], true)) $errors[] = 'Position must be Employee or Intern';
        if ($nda_accepted !== true) $errors[] = 'NDA acceptance is required';
        if (!is_array($nda_record) || ($nda_record['type'] ?? '') !== $position || empty($nda_record['agreement_id']) || empty($nda_record['version'])) $errors[] = 'A valid position-specific agreement acceptance is required';
        if (($_SESSION['registration_verified_email'] ?? '') !== strtolower(trim($email))) $errors[] = 'Email verification is required';
        
        // Validate experience fields if experienced
        if ($experience_level === 'experienced') {
            if (empty($company_name)) $errors[] = 'Company name is required for experienced candidates';
            if (empty($company_contact)) $errors[] = 'Company contact is required for experienced candidates';
            if (empty($experience_letter)) $errors[] = 'Experience letter is required for experienced candidates';
            if (empty($pay_slip)) $errors[] = 'Pay slip is required for experienced candidates';
            if (empty($offer_letter)) $errors[] = 'Offer letter is required for experienced candidates';
        }
        
        if (!empty($aadhaar_number) && !preg_match('/^[0-9]{12}$/', $aadhaar_number)) $errors[] = 'Aadhaar number must be 12 digits';
        if (!empty($pan_number) && !preg_match('/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/', $pan_number)) $errors[] = 'PAN number must be 10 characters';
        
        if (!empty($errors)) {
            echo json_encode(['success' => false, 'message' => 'Validation failed', 'errors' => $errors]);
            exit;
        }
        
        // Check if phone already exists
        $check_phone = $conn->prepare("SELECT id FROM users WHERE phone = ?");
        $check_phone->bind_param("s", $phone);
        $check_phone->execute();
        if ($check_phone->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Phone number already registered']);
            exit;
        }
        $check_phone->close();

        // Some older records may have an employee phone that is not present in users.
        // Check it too so a duplicate cannot later fail during admin approval.
        $check_employee_phone = $conn->prepare("SELECT id FROM employees WHERE phone = ?");
        $check_employee_phone->bind_param("s", $phone);
        $check_employee_phone->execute();
        if ($check_employee_phone->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Phone number is already assigned to an employee']);
            exit;
        }
        $check_employee_phone->close();
        
        // Check if email already exists in registration requests
        $check_email = $conn->prepare("SELECT id FROM registration_requests WHERE email = ?");
        $check_email->bind_param("s", $email);
        $check_email->execute();
        if ($check_email->get_result()->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Email already registered']);
            exit;
        }
        $check_email->close();
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Create the pending account and request together. It cannot log in until approved.
        $conn->begin_transaction();
        $user_stmt = $conn->prepare("INSERT INTO users (phone, password, role) VALUES (?, ?, 'employee')");
        $user_stmt->bind_param("ss", $phone, $hashed_password);
        
        if ($user_stmt->execute()) {
            $user_id = $conn->insert_id;
            
            // registration requests
            $reg_stmt = $conn->prepare("INSERT INTO registration_requests (employee_id, full_name, email, phone, photo, signature, position, nda_accepted, nda_record, nda_agreement_id, nda_version, nda_ip, date_of_birth, gender, address, city, state, pincode, department, designation, higher_education, experience_level, company_name, company_contact, aadhaar_front, aadhaar_back, pan_front, education_docs, experience_letter, pay_slip, offer_letter, age, blood_group, aadhaar_number, pan_number, emergency_contact_name, emergency_contact_relationship, emergency_contact_number, door_number, street, area_locality, district, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $education_docs_json = json_encode($education_docs);
            $age_int = intval($age);
            $status = 'pending';
            $nda_accepted_int = 1;
            $nda_record['accepted_at_server'] = gmdate('c');
            $nda_record_json = json_encode($nda_record, JSON_UNESCAPED_UNICODE);
            $nda_agreement_id = $nda_record['agreement_id'];
            $nda_version = $nda_record['version'];
            $nda_ip = $_SERVER['REMOTE_ADDR'] ?? '';
            $types = 'i' . str_repeat('s', 6) . 'i' . str_repeat('s', 4) . str_repeat('s', 19) . 'i' . str_repeat('s', 11);
            $reg_stmt->bind_param($types, $user_id, $full_name, $email, $phone, $photo, $signature, $position, $nda_accepted_int, $nda_record_json, $nda_agreement_id, $nda_version, $nda_ip, $date_of_birth, $gender, $address, $city, $state, $pincode, $department, $designation, $higher_education, $experience_level, $company_name, $company_contact, $aadhaar_front, $aadhaar_back, $pan_front, $education_docs_json, $experience_letter, $pay_slip, $offer_letter, $age_int, $blood_group, $aadhaar_number, $pan_number, $emergency_contact_name, $emergency_contact_relationship, $emergency_contact_number, $door_number, $street, $area_locality, $district, $status);
            
            if ($reg_stmt->execute()) {
                if ($conn->commit()) {
                    $email_result = send_registration_emails($email, $full_name, $phone, $position, $department, $designation, $nda_agreement_id);
                    
                    $message = $email_result['email_sent'] 
                        ? 'Registration submitted successfully and emails sent to both admin and employee. Please wait for admin approval.' 
                        : 'Registration submitted successfully. Note: ' . $email_result['email_error'];
                    
                    echo json_encode([
                        'success' => true,
                        'message' => $message,
                        'email_sent' => $email_result['email_sent'],
                        'user_id' => $user_id
                    ]);
                    unset($_SESSION['registration_verified_email']);
                } else {
                    $conn->rollback();
                    echo json_encode(['success' => false, 'message' => 'Failed to save registration', 'db_error' => $conn->error]);
                }
            } else {
                $conn->rollback();
                echo json_encode(['success' => false, 'message' => 'Failed to submit registration', 'db_error' => $reg_stmt->error]);
            }
            
            $reg_stmt->close();
        } else {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Failed to create user', 'db_error' => $user_stmt->error]);
        }
        
        $user_stmt->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();

function send_registration_emails($employee_email, $full_name, $phone, $position, $department, $designation, $agreement_id) {
    require_once 'email-functions.php';
    
    $email_sent = false;
    $email_error = '';
    
    try {
        // Send email to employee
        $result1 = send_registration_confirmation_to_employee($full_name, $employee_email);
        
        // Send email to admin
        $result2 = send_registration_submission_to_admin($full_name, $employee_email, $phone, $position, $department, $designation);
        
        $email_sent = ($result1['success'] && $result2['success']);
        if (!$email_sent) {
            $email_error = $result1['message'] ?? $result2['message'] ?? 'Email sending partially failed';
        }
    } catch (Exception $e) {
        $email_error = $e->getMessage();
        error_log("Email sending failed: " . $e->getMessage());
    }
    
    return ['email_sent' => $email_sent, 'email_error' => $email_error];
}
?>
