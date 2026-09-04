-- Run once on existing installations after schema.sql has already been imported.
ALTER TABLE attendance ADD COLUMN checkout_reason ENUM('break', 'complete', 'permission') NULL AFTER status;
CREATE TABLE IF NOT EXISTS attendance_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attendance_id INT NOT NULL,
  employee_id INT NOT NULL,
  action ENUM('check_in', 'check_out') NOT NULL,
  action_time DATETIME NOT NULL,
  reason ENUM('break', 'complete', 'permission') NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_attendance_logs_employee_time (employee_id, action_time)
);
CREATE TABLE IF NOT EXISTS role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_key VARCHAR(50) NOT NULL,
  permission_key VARCHAR(80) NOT NULL,
  UNIQUE KEY unique_role_permission (role_key, permission_key)
);
INSERT IGNORE INTO role_permissions (role_key, permission_key) VALUES
('ceo','*'),('ceo','roles.manage'),
('manager','dashboard.view'),('manager','attendance.self'),('manager','leaves.self'),('manager','notes.self'),('manager','profile.self'),('manager','projects.read'),('manager','projects.create'),('manager','projects.update'),('manager','attendance.read'),('manager','leaves.read'),('manager','leaves.update'),('manager','employees.read'),
('hr','dashboard.view'),('hr','attendance.self'),('hr','leaves.self'),('hr','notes.self'),('hr','profile.self'),('hr','employees.read'),('hr','employees.create'),('hr','employees.update'),('hr','attendance.read'),('hr','leaves.read'),('hr','leaves.update'),('hr','requests.read'),('hr','requests.update'),
('frontend_tl','dashboard.view'),('frontend_tl','attendance.self'),('frontend_tl','profile.self'),('frontend_tl','projects.read'),('frontend_tl','projects.update'),('frontend_tl','attendance.read'),
('backend_tl','dashboard.view'),('backend_tl','attendance.self'),('backend_tl','profile.self'),('backend_tl','projects.read'),('backend_tl','projects.update'),('backend_tl','attendance.read'),
('frontend_employee','dashboard.view'),('frontend_employee','attendance.self'),('frontend_employee','leaves.self'),('frontend_employee','notes.self'),('frontend_employee','profile.self'),
('backend_employee','dashboard.view'),('backend_employee','attendance.self'),('backend_employee','leaves.self'),('backend_employee','notes.self'),('backend_employee','profile.self'),
('frontend_intern','dashboard.view'),('frontend_intern','attendance.self'),('frontend_intern','profile.self'),
('backend_intern','dashboard.view'),('backend_intern','attendance.self'),('backend_intern','profile.self');
