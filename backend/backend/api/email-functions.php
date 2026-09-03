<?php
// Email functions for META MINDS PVT LTD
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

require_once '../config/mailer.php';

// Get company logo as base64
function get_company_logo() {
    $logo_path = __DIR__ . '/../../frontend/assets/images/meta_minds_logo.png';
    if (file_exists($logo_path)) {
        $type = pathinfo($logo_path, PATHINFO_EXTENSION);
        $data = file_get_contents($logo_path);
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }
    return '';
}

// Build professional email template with logo
function build_email_template($title, $content, $color = '#2563eb') {
    $logo = get_company_logo();
    $logo_html = $logo ? "<img src='$logo' alt='META MINDS Logo' style='max-width: 200px; margin-bottom: 20px;'>" : '';
    
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, $color 0%, #1e40af 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .content h2 { color: $color; margin-top: 0; font-size: 22px; }
            .info-box { background: #f8fafc; border-left: 4px solid $color; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .info-box p { margin: 5px 0; }
            .info-box strong { color: #1e293b; }
            .button { display: inline-block; padding: 12px 30px; background: $color; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: 500; }
            .footer { background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 12px; }
            .footer p { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                $logo_html
                <h1>META MINDS PVT LTD</h1>
            </div>
            <div class='content'>
                <h2>$title</h2>
                $content
            </div>
            <div class='footer'>
                <p>&copy; 2026 META MINDS PVT LTD. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

// Send registration submission email to admin
function send_registration_submission_to_admin($name, $email, $phone, $position, $department, $designation) {
    $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safe_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safe_phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $safe_position = htmlspecialchars(ucfirst($position), ENT_QUOTES, 'UTF-8');
    $safe_department = htmlspecialchars($department, ENT_QUOTES, 'UTF-8');
    $safe_designation = htmlspecialchars($designation, ENT_QUOTES, 'UTF-8');
    
    $content = "
        <p>A new employee has submitted their registration for approval.</p>
        <div class='info-box'>
            <p><strong>Name:</strong> $safe_name</p>
            <p><strong>Email:</strong> $safe_email</p>
            <p><strong>Phone:</strong> $safe_phone</p>
            <p><strong>Position:</strong> $safe_position</p>
            <p><strong>Department:</strong> $safe_department</p>
            <p><strong>Designation:</strong> $safe_designation</p>
        </div>
        <p>Please review and approve or reject this registration request in the admin panel.</p>
        <p>Best regards,<br>META MINDS PVT LTD System</p>
    ";
    
    $html = build_email_template('New Employee Registration', $content, '#2563eb');
    return meta_minds_send_email('admin@metaminds.com', 'New Employee Registration - META MINDS PVT LTD', $html);
}

// Send registration confirmation email to employee
function send_registration_confirmation_to_employee($name, $email) {
    $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    
    $content = "
        <p>Dear $safe_name,</p>
        <p>You have successfully registered with META MINDS PVT LTD.</p>
        <p>Your registration is currently pending admin approval. Our HR team will review your application and send you an update shortly.</p>
        <p>Thank you for choosing META MINDS PVT LTD.</p>
        <p>Best regards,<br>META MINDS PVT LTD Team</p>
    ";
    
    $html = build_email_template('Registration Received', $content, '#2563eb');
    return meta_minds_send_email($email, 'Registration Received - META MINDS PVT LTD', $html);
}

// Send approval email to employee with credentials
function send_approval_to_employee($name, $email, $employee_code, $password) {
    $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safe_employee_code = htmlspecialchars($employee_code, ENT_QUOTES, 'UTF-8');
    $safe_password = htmlspecialchars($password, ENT_QUOTES, 'UTF-8');
    
    $content = "
        <p>Dear $safe_name,</p>
        <p>We are pleased to inform you that your registration has been approved by the admin.</p>
        <div class='info-box'>
            <p><strong>Employee ID:</strong> $safe_employee_code</p>
            
            <p><strong>Login URL:</strong> <a href='https://metamindspvtltd.com/hr_portal/metaminds/frontend/employee/login.php'>https://metamindspvtltd.com/hr_portal/metaminds/frontend/employee/login.php</a></p>calhost/metaminds/frontend/employee/login.php</a></p>
        </div>
        <p>You can now log in to the employee portal using your Employee ID and the password provided above.</p>
        <p>Please complete your attendance check-in/check-out using the employee portal.</p>
        <p>Welcome to the META MINDS PVT LTD family!</p>
        <p>Best regards,<br>META MINDS PVT LTD Team</p>
    ";
    
    $html = build_email_template('Registration Approved', $content, '#16a34a');
    return meta_minds_send_email($email, 'Registration Approved - META MINDS PVT LTD', $html);
}

// Send approval notification to admin
function send_approval_notification_to_admin($name, $email, $employee_code, $department) {
    $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safe_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safe_employee_code = htmlspecialchars($employee_code, ENT_QUOTES, 'UTF-8');
    $safe_department = htmlspecialchars($department, ENT_QUOTES, 'UTF-8');
    
    $content = "
        <p>The following employee registration has been approved:</p>
        <div class='info-box'>
            <p><strong>Name:</strong> $safe_name</p>
            <p><strong>Email:</strong> $safe_email</p>
            <p><strong>Employee ID:</strong> $safe_employee_code</p>
            <p><strong>Department:</strong> $safe_department</p>
        </div>
        <p>The employee has been notified of their approval and login credentials.</p>
        <p>Best regards,<br>META MINDS PVT LTD System</p>
    ";
    
    $html = build_email_template('Employee Registration Approved', $content, '#16a34a');
    return meta_minds_send_email('admin@metaminds.com', 'Employee Registration Approved - META MINDS PVT LTD', $html);
}

// Send rejection email to employee
function send_rejection_to_employee($name, $email, $reason) {
    $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safe_reason = htmlspecialchars($reason, ENT_QUOTES, 'UTF-8');
    
    $content = "
        <p>Dear $safe_name,</p>
        <p>We regret to inform you that your registration has been rejected by the admin.</p>
        <div class='info-box'>
            <p><strong>Reason:</strong> $safe_reason</p>
        </div>
        <p>If you believe this is an error, please contact our HR team.</p>
        <p>Best regards,<br>META MINDS PVT LTD Team</p>
    ";
    
    $html = build_email_template('Registration Status Update', $content, '#dc2626');
    return meta_minds_send_email($email, 'Registration Status Update - META MINDS PVT LTD', $html);
}

// Send leave request email to admin
function send_leave_request_to_admin($employee_name, $employee_id, $employee_email, $leave_type, $start_date, $end_date, $reason) {
    $safe_name = htmlspecialchars($employee_name, ENT_QUOTES, 'UTF-8');
    $safe_employee_id = htmlspecialchars($employee_id, ENT_QUOTES, 'UTF-8');
    $safe_email = htmlspecialchars($employee_email, ENT_QUOTES, 'UTF-8');
    $safe_leave_type = htmlspecialchars($leave_type, ENT_QUOTES, 'UTF-8');
    $safe_start_date = htmlspecialchars($start_date, ENT_QUOTES, 'UTF-8');
    $safe_end_date = htmlspecialchars($end_date, ENT_QUOTES, 'UTF-8');
    $safe_reason = htmlspecialchars($reason, ENT_QUOTES, 'UTF-8');
    
    $content = "
        <p>A new leave request has been submitted:</p>
        <div class='info-box'>
            <p><strong>Employee Name:</strong> $safe_name</p>
            <p><strong>Employee ID:</strong> $safe_employee_id</p>
            <p><strong>Email:</strong> $safe_email</p>
            <p><strong>Leave Type:</strong> $safe_leave_type</p>
            <p><strong>Start Date:</strong> $safe_start_date</p>
            <p><strong>End Date:</strong> $safe_end_date</p>
            <p><strong>Reason:</strong> $safe_reason</p>
        </div>
        <p>Please review and approve or reject this leave request in the admin panel.</p>
        <p>Best regards,<br>META MINDS PVT LTD System</p>
    ";
    
    $html = build_email_template('New Leave Request', $content, '#2563eb');
    return meta_minds_send_email('admin@metaminds.com', 'New Leave Request - META MINDS PVT LTD', $html);
}

// Send leave request confirmation to employee
function send_leave_request_confirmation_to_employee($employee_name, $employee_email, $leave_type, $start_date, $end_date) {
    $safe_name = htmlspecialchars($employee_name, ENT_QUOTES, 'UTF-8');
    $safe_leave_type = htmlspecialchars($leave_type, ENT_QUOTES, 'UTF-8');
    $safe_start_date = htmlspecialchars($start_date, ENT_QUOTES, 'UTF-8');
    $safe_end_date = htmlspecialchars($end_date, ENT_QUOTES, 'UTF-8');
    
    $content = "
        <p>Dear $safe_name,</p>
        <p>Your leave request has been submitted successfully and is pending admin approval.</p>
        <div class='info-box'>
            <p><strong>Leave Type:</strong> $safe_leave_type</p>
            <p><strong>Start Date:</strong> $safe_start_date</p>
            <p><strong>End Date:</strong> $safe_end_date</p>
        </div>
        <p>You will receive another email once your request has been approved or rejected.</p>
        <p>Best regards,<br>META MINDS PVT LTD Team</p>
    ";
    
    $html = build_email_template('Leave Request Submitted', $content, '#2563eb');
    return meta_minds_send_email($employee_email, 'Leave Request Submitted - META MINDS PVT LTD', $html);
}

// Send leave approval/rejection email to employee
function send_leave_decision_to_employee($employee_name, $employee_email, $leave_type, $start_date, $end_date, $status, $admin_notes = '') {
    $safe_name = htmlspecialchars($employee_name, ENT_QUOTES, 'UTF-8');
    $safe_leave_type = htmlspecialchars($leave_type, ENT_QUOTES, 'UTF-8');
    $safe_start_date = htmlspecialchars($start_date, ENT_QUOTES, 'UTF-8');
    $safe_end_date = htmlspecialchars($end_date, ENT_QUOTES, 'UTF-8');
    $safe_notes = htmlspecialchars($admin_notes, ENT_QUOTES, 'UTF-8');
    
    $is_approved = $status === 'approved';
    $color = $is_approved ? '#16a34a' : '#dc2626';
    $status_text = $is_approved ? 'Approved' : 'Rejected';
    $message = $is_approved ? 'Your leave request has been approved.' : 'Your leave request has been rejected by the admin.';
    $closing = $is_approved ? '' : 'If you have any questions, please contact your manager.';
    
    $notes_html = $safe_notes ? "<p><strong>Admin Notes:</strong> $safe_notes</p>" : '';
    
    $content = "
        <p>Dear $safe_name,</p>
        <p>$message</p>
        <div class='info-box'>
            <p><strong>Leave Type:</strong> $safe_leave_type</p>
            <p><strong>Start Date:</strong> $safe_start_date</p>
            <p><strong>End Date:</strong> $safe_end_date</p>
            $notes_html
        </div>
        <p>$closing</p>
        <p>Best regards,<br>META MINDS PVT LTD Team</p>
    ";
    
    $html = build_email_template("Leave Request $status_text", $content, $color);
    return meta_minds_send_email($employee_email, "Leave Request $status - META MINDS PVT LTD", $html);
}

// Send leave decision notification to admin
function send_leave_decision_to_admin($employee_name, $employee_id, $leave_type, $start_date, $end_date, $status) {
    $safe_name = htmlspecialchars($employee_name, ENT_QUOTES, 'UTF-8');
    $safe_employee_id = htmlspecialchars($employee_id, ENT_QUOTES, 'UTF-8');
    $safe_leave_type = htmlspecialchars($leave_type, ENT_QUOTES, 'UTF-8');
    $safe_start_date = htmlspecialchars($start_date, ENT_QUOTES, 'UTF-8');
    $safe_end_date = htmlspecialchars($end_date, ENT_QUOTES, 'UTF-8');
    
    $is_approved = $status === 'approved';
    $color = $is_approved ? '#16a34a' : '#dc2626';
    $status_text = $is_approved ? 'Approved' : 'Rejected';
    
    $content = "
        <p>The following leave request has been <strong>$status</strong>:</p>
        <div class='info-box'>
            <p><strong>Employee Name:</strong> $safe_name</p>
            <p><strong>Employee ID:</strong> $safe_employee_id</p>
            <p><strong>Leave Type:</strong> $safe_leave_type</p>
            <p><strong>Start Date:</strong> $safe_start_date</p>
            <p><strong>End Date:</strong> $safe_end_date</p>
        </div>
        <p>The employee has been notified of the decision.</p>
        <p>Best regards,<br>META MINDS PVT LTD System</p>
    ";
    
    $html = build_email_template("Leave Request $status_text", $content, $color);
    return meta_minds_send_email('admin@metaminds.com', "Leave Request $status - META MINDS PVT LTD", $html);
}
?>
