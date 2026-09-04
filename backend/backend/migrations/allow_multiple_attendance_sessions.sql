-- Run once on existing installations.
-- The application supports multiple check-in/check-out sessions in one day.
ALTER TABLE attendance
    ADD INDEX idx_attendance_employee_date (employee_id, date),
    DROP INDEX unique_employee_date;
