<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
session_start();
require_once '../config/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $data['action'] ?? '';
$email = strtolower(trim($data['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Enter a valid email address']);
    exit;
}

if ($action === 'send') {
    $lastSent = $_SESSION['registration_otp_sent_at'] ?? 0;
    if (time() - $lastSent < 60) {
        echo json_encode(['success' => false, 'message' => 'Please wait one minute before requesting another OTP']);
        exit;
    }

    $otp = (string) random_int(100000, 999999);
    $_SESSION['registration_otp_hash'] = password_hash($otp, PASSWORD_DEFAULT);
    $_SESSION['registration_otp_email'] = $email;
    $_SESSION['registration_otp_expires_at'] = time() + 600;
    $_SESSION['registration_otp_sent_at'] = time();
    unset($_SESSION['registration_verified_email']);

    $subject = 'Your META MINDS registration verification code';
    $message = "<div style='font-family:Arial,sans-serif;color:#172033'><h2 style='color:#2563eb'>META MINDS PVT. LTD.</h2><p>Your email verification code is:</p><p style='font-size:30px;font-weight:bold;letter-spacing:8px'>$otp</p><p>This OTP expires in 10 minutes. Do not share it with anyone.</p></div>";
    $delivery = meta_minds_send_email($email, $subject, $message);
    if (!$delivery['success']) {
        // Log OTP for testing if SMTP is not configured
        error_log("OTP for $email: $otp (SMTP not configured)");
        // Still return success for testing purposes with a note
        echo json_encode(['success' => true, 'message' => 'OTP sent (SMTP not configured - check server logs for OTP)', 'otp' => $otp, 'test_mode' => true]);
        exit;
    }
    echo json_encode(['success' => true, 'message' => 'OTP sent']);
    exit;
}

if ($action === 'verify') {
    $otp = trim($data['otp'] ?? '');
    $valid = preg_match('/^\d{6}$/', $otp)
        && ($_SESSION['registration_otp_email'] ?? '') === $email
        && time() <= ($_SESSION['registration_otp_expires_at'] ?? 0)
        && isset($_SESSION['registration_otp_hash'])
        && password_verify($otp, $_SESSION['registration_otp_hash']);
    if (!$valid) {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP']);
        exit;
    }
    $_SESSION['registration_verified_email'] = $email;
    unset($_SESSION['registration_otp_hash'], $_SESSION['registration_otp_expires_at']);
    echo json_encode(['success' => true, 'message' => 'Email verified']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Unknown OTP action']);
?>
