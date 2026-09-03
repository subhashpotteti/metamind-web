-- Run once on an existing meta_minds database after add_registration_fields.sql.
ALTER TABLE registration_requests
    ADD COLUMN signature VARCHAR(255) DEFAULT NULL AFTER photo,
    ADD COLUMN position ENUM('employee', 'intern') DEFAULT 'employee' AFTER signature,
    ADD COLUMN nda_accepted TINYINT(1) NOT NULL DEFAULT 0 AFTER position;

ALTER TABLE registration_requests
    ADD COLUMN nda_record TEXT DEFAULT NULL AFTER nda_accepted,
    ADD COLUMN nda_agreement_id VARCHAR(80) DEFAULT NULL AFTER nda_record,
    ADD COLUMN nda_version VARCHAR(100) DEFAULT NULL AFTER nda_agreement_id,
    ADD COLUMN nda_ip VARCHAR(45) DEFAULT NULL AFTER nda_version;

ALTER TABLE employees
    ADD COLUMN signature VARCHAR(255) DEFAULT NULL AFTER photo,
    ADD COLUMN position ENUM('employee', 'intern') DEFAULT 'employee' AFTER signature,
    ADD COLUMN nda_accepted TINYINT(1) NOT NULL DEFAULT 0 AFTER position;

ALTER TABLE employees
    ADD COLUMN nda_record TEXT DEFAULT NULL AFTER nda_accepted,
    ADD COLUMN nda_agreement_id VARCHAR(80) DEFAULT NULL AFTER nda_record,
    ADD COLUMN nda_version VARCHAR(100) DEFAULT NULL AFTER nda_agreement_id,
    ADD COLUMN nda_ip VARCHAR(45) DEFAULT NULL AFTER nda_version;
