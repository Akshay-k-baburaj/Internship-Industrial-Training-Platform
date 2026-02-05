-- Update passwords for all users to 'admin123'
-- Hash generated from backend: $2a$10$9Ajdgt93S.TUBGiUBzxblONsySouaOTpMWsorvNpmJVSWFoCl34.S

UPDATE users 
SET password = '$2a$10$9Ajdgt93S.TUBGiUBzxblONsySouaOTpMWsorvNpmJVSWFoCl34.S' 
WHERE email IN ('student1@college.com', 'vikram@college.com', 'student3@college.com', 'admin@internship.com');
