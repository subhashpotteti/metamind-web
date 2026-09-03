-- Add new columns to registration_requests table
ALTER TABLE registration_requests 
ADD COLUMN higher_education VARCHAR(50) DEFAULT NULL AFTER designation,
ADD COLUMN experience_level VARCHAR(50) DEFAULT NULL AFTER higher_education,
ADD COLUMN company_name VARCHAR(255) DEFAULT NULL AFTER experience_level,
ADD COLUMN company_contact VARCHAR(20) DEFAULT NULL AFTER company_name,
ADD COLUMN aadhaar_front VARCHAR(255) DEFAULT NULL AFTER company_contact,
ADD COLUMN aadhaar_back VARCHAR(255) DEFAULT NULL AFTER aadhaar_front,
ADD COLUMN pan_front VARCHAR(255) DEFAULT NULL AFTER aadhaar_back,
ADD COLUMN education_docs TEXT DEFAULT NULL AFTER pan_front,
ADD COLUMN experience_letter VARCHAR(255) DEFAULT NULL AFTER education_docs,
ADD COLUMN pay_slip VARCHAR(255) DEFAULT NULL AFTER experience_letter,
ADD COLUMN offer_letter VARCHAR(255) DEFAULT NULL AFTER pay_slip;


-- Add new columns to employees table
ALTER TABLE employees 
ADD COLUMN higher_education VARCHAR(50) DEFAULT NULL AFTER designation,
ADD COLUMN experience_level VARCHAR(50) DEFAULT NULL AFTER higher_education,
ADD COLUMN company_name VARCHAR(255) DEFAULT NULL AFTER experience_level,
ADD COLUMN company_contact VARCHAR(20) DEFAULT NULL AFTER company_name,
ADD COLUMN aadhaar_front VARCHAR(255) DEFAULT NULL AFTER company_contact,
ADD COLUMN aadhaar_back VARCHAR(255) DEFAULT NULL AFTER aadhaar_front,
ADD COLUMN pan_front VARCHAR(255) DEFAULT NULL AFTER aadhaar_back,
ADD COLUMN education_docs TEXT DEFAULT NULL AFTER pan_front,
ADD COLUMN experience_letter VARCHAR(255) DEFAULT NULL AFTER education_docs,
ADD COLUMN pay_slip VARCHAR(255) DEFAULT NULL AFTER experience_letter,
ADD COLUMN offer_letter VARCHAR(255) DEFAULT NULL AFTER pay_slip;
