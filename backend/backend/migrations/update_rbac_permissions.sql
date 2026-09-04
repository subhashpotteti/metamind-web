-- Migration script to update role-based permissions with full CRUD operations
-- This script adds comprehensive CRUD permissions for all modules

USE meta_minds_hrm;

-- Clear existing role permissions to start fresh
TRUNCATE TABLE role_permissions;

-- Insert comprehensive CRUD permissions for all roles
INSERT INTO role_permissions (role_key, permission_key) VALUES
-- CEO has full access
('ceo', '*'), ('ceo', 'roles.manage'),

-- Manager permissions
('manager', 'dashboard.view'), 
('manager', 'attendance.self'), ('manager', 'attendance.read'), ('manager', 'attendance.create'), ('manager', 'attendance.update'), ('manager', 'attendance.delete'),
('manager', 'leaves.self'), ('manager', 'leaves.read'), ('manager', 'leaves.create'), ('manager', 'leaves.update'), ('manager', 'leaves.delete'),
('manager', 'notes.self'), ('manager', 'notes.read'), ('manager', 'notes.create'), ('manager', 'notes.update'), ('manager', 'notes.delete'),
('manager', 'profile.self'),
('manager', 'projects.read'), ('manager', 'projects.create'), ('manager', 'projects.update'), ('manager', 'projects.delete'),
('manager', 'employees.read'),
('manager', 'notifications.self'), ('manager', 'notifications.read'),
('manager', 'tasks.read'), ('manager', 'tasks.create'), ('manager', 'tasks.update'), ('manager', 'tasks.delete'),

-- HR permissions
('hr', 'dashboard.view'), 
('hr', 'attendance.self'), ('hr', 'attendance.read'), ('hr', 'attendance.create'), ('hr', 'attendance.update'),
('hr', 'leaves.self'), ('hr', 'leaves.read'), ('hr', 'leaves.create'), ('hr', 'leaves.update'), ('hr', 'leaves.delete'),
('hr', 'notes.self'), ('hr', 'notes.read'), ('hr', 'notes.create'), ('hr', 'notes.update'),
('hr', 'profile.self'),
('hr', 'employees.read'), ('hr', 'employees.create'), ('hr', 'employees.update'), ('hr', 'employees.delete'),
('hr', 'requests.read'), ('hr', 'requests.update'),
('hr', 'notifications.self'), ('hr', 'notifications.read'),

-- Frontend Team Lead permissions
('frontend_tl', 'dashboard.view'), 
('frontend_tl', 'attendance.self'), ('frontend_tl', 'attendance.read'), ('frontend_tl', 'attendance.create'), ('frontend_tl', 'attendance.update'),
('frontend_tl', 'profile.self'),
('frontend_tl', 'projects.read'), ('frontend_tl', 'projects.create'), ('frontend_tl', 'projects.update'),
('frontend_tl', 'notes.self'), ('frontend_tl', 'notes.read'), ('frontend_tl', 'notes.create'), ('frontend_tl', 'notes.update'),
('frontend_tl', 'notifications.self'), ('frontend_tl', 'notifications.read'),
('frontend_tl', 'tasks.read'), ('frontend_tl', 'tasks.create'), ('frontend_tl', 'tasks.update'),

-- Backend Team Lead permissions
('backend_tl', 'dashboard.view'), 
('backend_tl', 'attendance.self'), ('backend_tl', 'attendance.read'), ('backend_tl', 'attendance.create'), ('backend_tl', 'attendance.update'),
('backend_tl', 'profile.self'),
('backend_tl', 'projects.read'), ('backend_tl', 'projects.create'), ('backend_tl', 'projects.update'),
('backend_tl', 'notes.self'), ('backend_tl', 'notes.read'), ('backend_tl', 'notes.create'), ('backend_tl', 'notes.update'),
('backend_tl', 'notifications.self'), ('backend_tl', 'notifications.read'),
('backend_tl', 'tasks.read'), ('backend_tl', 'tasks.create'), ('backend_tl', 'tasks.update'),

-- Frontend Employee permissions
('frontend_employee', 'dashboard.view'), 
('frontend_employee', 'attendance.self'), ('frontend_employee', 'attendance.create'), ('frontend_employee', 'attendance.update'),
('frontend_employee', 'leaves.self'), ('frontend_employee', 'leaves.create'), ('frontend_employee', 'leaves.update'),
('frontend_employee', 'notes.self'), ('frontend_employee', 'notes.read'), ('frontend_employee', 'notes.create'), ('frontend_employee', 'notes.update'), ('frontend_employee', 'notes.delete'),
('frontend_employee', 'profile.self'),
('frontend_employee', 'notifications.self'), ('frontend_employee', 'notifications.read'), ('frontend_employee', 'notifications.update'),
('frontend_employee', 'tasks.read'), ('frontend_employee', 'tasks.create'), ('frontend_employee', 'tasks.update'),

-- Backend Employee permissions
('backend_employee', 'dashboard.view'), 
('backend_employee', 'attendance.self'), ('backend_employee', 'attendance.create'), ('backend_employee', 'attendance.update'),
('backend_employee', 'leaves.self'), ('backend_employee', 'leaves.create'), ('backend_employee', 'leaves.update'),
('backend_employee', 'notes.self'), ('backend_employee', 'notes.read'), ('backend_employee', 'notes.create'), ('backend_employee', 'notes.update'), ('backend_employee', 'notes.delete'),
('backend_employee', 'profile.self'),
('backend_employee', 'notifications.self'), ('backend_employee', 'notifications.read'), ('backend_employee', 'notifications.update'),
('backend_employee', 'tasks.read'), ('backend_employee', 'tasks.create'), ('backend_employee', 'tasks.update'),

-- Frontend Intern permissions
('frontend_intern', 'dashboard.view'), 
('frontend_intern', 'attendance.self'), ('frontend_intern', 'attendance.create'), ('frontend_intern', 'attendance.update'),
('frontend_intern', 'profile.self'),
('frontend_intern', 'notifications.self'), ('frontend_intern', 'notifications.read'),
('frontend_intern', 'tasks.read'),

-- Backend Intern permissions
('backend_intern', 'dashboard.view'), 
('backend_intern', 'attendance.self'), ('backend_intern', 'attendance.create'), ('backend_intern', 'attendance.update'),
('backend_intern', 'profile.self'),
('backend_intern', 'notifications.self'), ('backend_intern', 'notifications.read'),
('backend_intern', 'tasks.read');

-- Verify the permissions were inserted correctly
SELECT role_key, COUNT(*) as permission_count FROM role_permissions GROUP BY role_key ORDER BY role_key;
