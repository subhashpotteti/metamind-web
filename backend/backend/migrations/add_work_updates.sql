-- Run once on existing installations.
CREATE TABLE IF NOT EXISTS work_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_id INT NOT NULL,
    work_update TEXT NOT NULL,
    work_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_work_updates_date (work_date, created_at),
    INDEX idx_work_updates_employee (employee_id),
    CONSTRAINT fk_work_updates_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_work_updates_attendance FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE
);
