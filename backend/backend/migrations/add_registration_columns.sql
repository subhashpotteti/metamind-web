-- Add missing columns to registration_requests table for multi-step form
ALTER TABLE registration_requests 
ADD COLUMN signature VARCHAR(255) DEFAULT NULL AFTER offer_letter,
ADD COLUMN position VARCHAR(50) DEFAULT NULL AFTER signature,
ADD COLUMN nda_acceptance TEXT DEFAULT NULL AFTER position,
ADD COLUMN password VARCHAR(255) DEFAULT NULL AFTER nda_acceptance;
