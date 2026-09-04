-- Migration script to change designation column from VARCHAR to ENUM
-- This ensures data consistency with the role-based permissions system

-- Update existing designation values to match standard role keys
UPDATE employees SET designation = 'frontend_tl' WHERE designation LIKE '%frontend%' AND (designation LIKE '%lead%' OR designation LIKE '%tl%');
UPDATE employees SET designation = 'backend_tl' WHERE designation LIKE '%backend%' AND (designation LIKE '%lead%' OR designation LIKE '%tl%');
UPDATE employees SET designation = 'frontend_employee' WHERE designation LIKE '%frontend%' AND designation NOT LIKE '%intern%' AND designation NOT LIKE '%lead%' AND designation NOT LIKE '%tl%';
UPDATE employees SET designation = 'backend_employee' WHERE designation LIKE '%backend%' AND designation NOT LIKE '%intern%' AND designation NOT LIKE '%lead%' AND designation NOT LIKE '%tl%';
UPDATE employees SET designation = 'frontend_intern' WHERE designation LIKE '%intern%' AND (designation LIKE '%frontend%' OR designation = 'Intern');
UPDATE employees SET designation = 'backend_intern' WHERE designation LIKE '%intern%' AND designation LIKE '%backend%';
UPDATE employees SET designation = 'frontend_intern' WHERE designation = 'Intern' AND designation NOT LIKE '%backend%';

-- Update registration_requests table as well
UPDATE registration_requests SET designation = 'frontend_tl' WHERE designation LIKE '%frontend%' AND (designation LIKE '%lead%' OR designation LIKE '%tl%');
UPDATE registration_requests SET designation = 'backend_tl' WHERE designation LIKE '%backend%' AND (designation LIKE '%lead%' OR designation LIKE '%tl%');
UPDATE registration_requests SET designation = 'frontend_employee' WHERE designation LIKE '%frontend%' AND designation NOT LIKE '%intern%' AND designation NOT LIKE '%lead%' AND designation NOT LIKE '%tl%';
UPDATE registration_requests SET designation = 'backend_employee' WHERE designation LIKE '%backend%' AND designation NOT LIKE '%intern%' AND designation NOT LIKE '%lead%' AND designation NOT LIKE '%tl%';
UPDATE registration_requests SET designation = 'frontend_intern' WHERE designation LIKE '%intern%' AND (designation LIKE '%frontend%' OR designation = 'Intern');
UPDATE registration_requests SET designation = 'backend_intern' WHERE designation LIKE '%intern%' AND designation LIKE '%backend%';
UPDATE registration_requests SET designation = 'frontend_intern' WHERE designation = 'Intern' AND designation NOT LIKE '%backend%';

-- Alter employees table to change designation to ENUM
ALTER TABLE employees MODIFY COLUMN designation ENUM('ceo','manager','hr','frontend_tl','frontend_employee','frontend_intern','backend_tl','backend_employee','backend_intern');

-- Alter registration_requests table to change designation to ENUM
ALTER TABLE registration_requests MODIFY COLUMN designation ENUM('ceo','manager','hr','frontend_tl','frontend_employee','frontend_intern','backend_tl','backend_employee','backend_intern');

-- Show the results
SELECT designation, COUNT(*) as count FROM employees GROUP BY designation;
SELECT designation, COUNT(*) as count FROM registration_requests GROUP BY designation;
