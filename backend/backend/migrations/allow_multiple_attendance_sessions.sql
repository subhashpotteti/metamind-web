USE meta_minds_hrm;

ALTER TABLE attendance
    DROP INDEX unique_employee_date,
    ADD INDEX idx_attendance_employee_date (employee_id, date);