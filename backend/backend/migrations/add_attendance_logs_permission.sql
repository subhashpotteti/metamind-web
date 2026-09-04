-- Run once on existing installations. Attendance logs already record every check-in/check-out.
INSERT IGNORE INTO role_permissions (role_key, permission_key) VALUES
('manager', 'attendance_logs.read'), ('manager', 'work_updates.read'),
('hr', 'attendance_logs.read'), ('hr', 'work_updates.read'),
('frontend_tl', 'attendance_logs.read'), ('frontend_tl', 'work_updates.read'),
('backend_tl', 'attendance_logs.read'), ('backend_tl', 'work_updates.read');
