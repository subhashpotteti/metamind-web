-- Create Database
CREATE DATABASE IF NOT EXISTS meta_minds_hrm;
USE meta_minds_hrm;

-- Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    photo VARCHAR(255),
    signature VARCHAR(255),
    position ENUM('employee', 'intern') DEFAULT 'employee',
    nda_accepted TINYINT(1) NOT NULL DEFAULT 0,
    nda_record TEXT,
    nda_agreement_id VARCHAR(80),
    nda_version VARCHAR(100),
    nda_ip VARCHAR(45),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    department VARCHAR(50),
    designation ENUM('ceo','manager','hr','frontend_tl','frontend_employee','frontend_intern','backend_tl','backend_employee','backend_intern'),
    age INT,
    blood_group VARCHAR(5),
    aadhaar_number VARCHAR(12),
    pan_number VARCHAR(10),
    emergency_contact_name VARCHAR(100),
    emergency_contact_relationship VARCHAR(50),
    emergency_contact_number VARCHAR(15),
    door_number VARCHAR(100),
    street VARCHAR(100),
    area_locality VARCHAR(100),
    district VARCHAR(100),
    joining_date DATE,
    salary DECIMAL(10,2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Registration Requests Table
CREATE TABLE IF NOT EXISTS registration_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    photo VARCHAR(255),
    signature VARCHAR(255),
    position ENUM('employee', 'intern') DEFAULT 'employee',
    nda_accepted TINYINT(1) NOT NULL DEFAULT 0,
    nda_record TEXT,
    nda_agreement_id VARCHAR(80),
    nda_version VARCHAR(100),
    nda_ip VARCHAR(45),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    department VARCHAR(50),
    designation ENUM('ceo','manager','hr','frontend_tl','frontend_employee','frontend_intern','backend_tl','backend_employee','backend_intern'),
    expected_salary DECIMAL(10,2),
    age INT,
    blood_group VARCHAR(5),
    aadhaar_number VARCHAR(12),
    pan_number VARCHAR(10),
    emergency_contact_name VARCHAR(100),
    emergency_contact_relationship VARCHAR(50),
    emergency_contact_number VARCHAR(15),
    door_number VARCHAR(100),
    street VARCHAR(100),
    area_locality VARCHAR(100),
    district VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    check_in_time DATETIME,
    check_out_time DATETIME,
    date DATE NOT NULL,
    total_hours DECIMAL(5,2),
    status ENUM('present', 'absent', 'half_day') DEFAULT 'present',
    checkout_reason ENUM('break', 'complete', 'permission') NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_attendance_employee_date (employee_id, date)
);

-- Immutable audit trail for every attendance action.
CREATE TABLE IF NOT EXISTS attendance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attendance_id INT NOT NULL,
    employee_id INT NOT NULL,
    action ENUM('check_in', 'check_out') NOT NULL,
    action_time DATETIME NOT NULL,
    reason ENUM('break', 'complete', 'permission') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_attendance_logs_employee_time (employee_id, action_time)
);

-- A designation maps to a permission set. CEO has all permissions; other roles
-- receive the least privileges needed for their workspace.
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_key VARCHAR(50) NOT NULL,
    permission_key VARCHAR(80) NOT NULL,
    UNIQUE KEY unique_role_permission (role_key, permission_key)
);

INSERT IGNORE INTO role_permissions (role_key, permission_key) VALUES
('ceo', '*'), ('ceo', 'roles.manage'),
('manager', 'dashboard.view'), ('manager', 'attendance.self'), ('manager', 'attendance.read'), ('manager', 'attendance.create'), ('manager', 'attendance.update'), ('manager', 'attendance.delete'), ('manager', 'leaves.self'), ('manager', 'leaves.read'), ('manager', 'leaves.create'), ('manager', 'leaves.update'), ('manager', 'leaves.delete'), ('manager', 'notes.self'), ('manager', 'notes.read'), ('manager', 'notes.create'), ('manager', 'notes.update'), ('manager', 'notes.delete'), ('manager', 'profile.self'), ('manager', 'projects.read'), ('manager', 'projects.create'), ('manager', 'projects.update'), ('manager', 'projects.delete'), ('manager', 'employees.read'), ('manager', 'notifications.self'), ('manager', 'notifications.read'), ('manager', 'tasks.read'), ('manager', 'tasks.create'), ('manager', 'tasks.update'), ('manager', 'tasks.delete'),
('hr', 'dashboard.view'), ('hr', 'attendance.self'), ('hr', 'attendance.read'), ('hr', 'attendance.create'), ('hr', 'attendance.update'), ('hr', 'leaves.self'), ('hr', 'leaves.read'), ('hr', 'leaves.create'), ('hr', 'leaves.update'), ('hr', 'leaves.delete'), ('hr', 'notes.self'), ('hr', 'notes.read'), ('hr', 'notes.create'), ('hr', 'notes.update'), ('hr', 'profile.self'), ('hr', 'employees.read'), ('hr', 'employees.create'), ('hr', 'employees.update'), ('hr', 'employees.delete'), ('hr', 'requests.read'), ('hr', 'requests.update'), ('hr', 'notifications.self'), ('hr', 'notifications.read'),
('frontend_tl', 'dashboard.view'), ('frontend_tl', 'attendance.self'), ('frontend_tl', 'attendance.read'), ('frontend_tl', 'attendance.create'), ('frontend_tl', 'attendance.update'), ('frontend_tl', 'profile.self'), ('frontend_tl', 'projects.read'), ('frontend_tl', 'projects.create'), ('frontend_tl', 'projects.update'), ('frontend_tl', 'notes.self'), ('frontend_tl', 'notes.read'), ('frontend_tl', 'notes.create'), ('frontend_tl', 'notes.update'), ('frontend_tl', 'notifications.self'), ('frontend_tl', 'notifications.read'), ('frontend_tl', 'tasks.read'), ('frontend_tl', 'tasks.create'), ('frontend_tl', 'tasks.update'),
('backend_tl', 'dashboard.view'), ('backend_tl', 'attendance.self'), ('backend_tl', 'attendance.read'), ('backend_tl', 'attendance.create'), ('backend_tl', 'attendance.update'), ('backend_tl', 'profile.self'), ('backend_tl', 'projects.read'), ('backend_tl', 'projects.create'), ('backend_tl', 'projects.update'), ('backend_tl', 'notes.self'), ('backend_tl', 'notes.read'), ('backend_tl', 'notes.create'), ('backend_tl', 'notes.update'), ('backend_tl', 'notifications.self'), ('backend_tl', 'notifications.read'), ('backend_tl', 'tasks.read'), ('backend_tl', 'tasks.create'), ('backend_tl', 'tasks.update'),
('frontend_employee', 'dashboard.view'), ('frontend_employee', 'attendance.self'), ('frontend_employee', 'attendance.create'), ('frontend_employee', 'attendance.update'), ('frontend_employee', 'leaves.self'), ('frontend_employee', 'leaves.create'), ('frontend_employee', 'leaves.update'), ('frontend_employee', 'notes.self'), ('frontend_employee', 'notes.read'), ('frontend_employee', 'notes.create'), ('frontend_employee', 'notes.update'), ('frontend_employee', 'notes.delete'), ('frontend_employee', 'profile.self'), ('frontend_employee', 'notifications.self'), ('frontend_employee', 'notifications.read'), ('frontend_employee', 'notifications.update'), ('frontend_employee', 'tasks.read'), ('frontend_employee', 'tasks.create'), ('frontend_employee', 'tasks.update'),
('backend_employee', 'dashboard.view'), ('backend_employee', 'attendance.self'), ('backend_employee', 'attendance.create'), ('backend_employee', 'attendance.update'), ('backend_employee', 'leaves.self'), ('backend_employee', 'leaves.create'), ('backend_employee', 'leaves.update'), ('backend_employee', 'notes.self'), ('backend_employee', 'notes.read'), ('backend_employee', 'notes.create'), ('backend_employee', 'notes.update'), ('backend_employee', 'notes.delete'), ('backend_employee', 'profile.self'), ('backend_employee', 'notifications.self'), ('backend_employee', 'notifications.read'), ('backend_employee', 'notifications.update'), ('backend_employee', 'tasks.read'), ('backend_employee', 'tasks.create'), ('backend_employee', 'tasks.update'),
('frontend_intern', 'dashboard.view'), ('frontend_intern', 'attendance.self'), ('frontend_intern', 'attendance.create'), ('frontend_intern', 'attendance.update'), ('frontend_intern', 'profile.self'), ('frontend_intern', 'notifications.self'), ('frontend_intern', 'notifications.read'), ('frontend_intern', 'tasks.read'),
('backend_intern', 'dashboard.view'), ('backend_intern', 'attendance.self'), ('backend_intern', 'attendance.create'), ('backend_intern', 'attendance.update'), ('backend_intern', 'profile.self'), ('backend_intern', 'notifications.self'), ('backend_intern', 'notifications.read'), ('backend_intern', 'tasks.read');

-- Leadership-only access to the immutable check-in/check-out audit trail.
INSERT IGNORE INTO role_permissions (role_key, permission_key) VALUES
('manager', 'attendance_logs.read'), ('hr', 'attendance_logs.read'),
('frontend_tl', 'attendance_logs.read'), ('backend_tl', 'attendance_logs.read');

INSERT IGNORE INTO role_permissions (role_key, permission_key) VALUES
('manager', 'work_updates.read'), ('hr', 'work_updates.read'),
('frontend_tl', 'work_updates.read'), ('backend_tl', 'work_updates.read');

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    to_email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status ENUM('sent', 'failed') DEFAULT 'sent',
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Public website contact submissions.
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    company VARCHAR(150),
    service VARCHAR(100),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contact_submissions_created (created_at),
    INDEX idx_contact_submissions_status (status)
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    client_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    status ENUM('planning', 'in_progress', 'on_hold', 'completed', 'cancelled') DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project Assignments Table
CREATE TABLE IF NOT EXISTS project_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    employee_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'team_member',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_employee (project_id, employee_id)
);

-- Revenue Table
CREATE TABLE IF NOT EXISTS revenue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    amount DECIMAL(15,2) NOT NULL,
    type ENUM('payment_received', 'invoice_sent', 'pending') DEFAULT 'pending',
    description VARCHAR(255),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type ENUM('sick', 'casual', 'earned', 'maternity', 'paternity', 'other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Work Updates Table
CREATE TABLE IF NOT EXISTS work_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_id INT NOT NULL,
    work_update TEXT NOT NULL,
    work_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_work_updates_date (work_date, created_at),
    INDEX idx_work_updates_employee (employee_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'leave', 'attendance', 'project') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    employee_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in_progress', 'review', 'completed') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Insert Default Admin (Phone: 9701849967, Password: 123456)
INSERT INTO users (phone, password, role) VALUES 
('9701849967', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin')
ON DUPLICATE KEY UPDATE phone=phone;
