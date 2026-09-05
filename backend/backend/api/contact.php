<?php
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
header('Content-Type: application/json; charset=UTF-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ['http://localhost:5173', 'http://127.0.0.1:5173'], true)) header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once '../config/database.php';
require_once '../config/permissions.php';
require_once 'email-functions.php';

function contact_response($success, $message, $extra = []) {
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) contact_response(false, 'Invalid request data');

    $name = trim((string)($data['name'] ?? ''));
    $email = trim((string)($data['email'] ?? ''));
    $phone = trim((string)($data['phone'] ?? ''));
    $company = trim((string)($data['company'] ?? ''));
    $service = trim((string)($data['service'] ?? ''));
    $message = trim((string)($data['message'] ?? ''));

    if ($name === '' || mb_strlen($name) > 150) contact_response(false, 'Please provide a valid name');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) contact_response(false, 'Please provide a valid email address');
    if (!preg_match('/^[+0-9()\s-]{7,30}$/', $phone)) contact_response(false, 'Please provide a valid phone number');
    if ($message === '' || mb_strlen($message) > 10000) contact_response(false, 'Please provide a message of 10,000 characters or fewer');

    $stmt = $conn->prepare('INSERT INTO contact_submissions (name, email, phone, company, service, message) VALUES (?, ?, ?, ?, ?, ?)');
    if (!$stmt) { error_log('Contact insert prepare failed: ' . $conn->error); contact_response(false, 'Unable to save your message'); }
    $stmt->bind_param('ssssss', $name, $email, $phone, $company, $service, $message);
    if (!$stmt->execute()) { error_log('Contact insert failed: ' . $stmt->error); $stmt->close(); contact_response(false, 'Unable to save your message'); }
    $contactId = $conn->insert_id;
    $stmt->close();

    $adminEmail = getenv('META_MINDS_CONTACT_EMAIL') ?: 'admin@metaminds.com';
    $adminMail = send_contact_submission_to_admin($name, $email, $phone, $company, $service, $message, $adminEmail);
    $userMail = send_contact_confirmation_to_user($name, $email, $service);
    if (!$adminMail['success']) error_log('Contact admin email failed: ' . ($adminMail['message'] ?? 'Unknown error'));
    if (!$userMail['success']) error_log('Contact user email failed: ' . ($userMail['message'] ?? 'Unknown error'));
    contact_response(true, 'Your message was submitted successfully.', ['contact_id' => $contactId, 'emails_sent' => $adminMail['success'] && $userMail['success']]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_permission($conn, 'contacts.read');
    $stmt = $conn->prepare('SELECT id, name, email, phone, company, service, message, status, created_at, updated_at FROM contact_submissions ORDER BY created_at DESC');
    $stmt->execute(); $result = $stmt->get_result(); $contacts = [];
    while ($row = $result->fetch_assoc()) $contacts[] = $row;
    $stmt->close();
    echo json_encode(['success' => true, 'contacts' => $contacts]);
    exit;
}

http_response_code(405);
contact_response(false, 'Method not allowed');