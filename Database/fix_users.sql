INSERT INTO users (email, password, role, is_active, is_verified, created_at, updated_at)
VALUES 
('student1@college.com', '$2a$10$9Ajdgt93S.TUBGiUBzxblONsySouaOTpMWsorvNpmJVSWFoCl34.S', 'STUDENT', true, true, NOW(), NOW()),
('vikram@college.com', '$2a$10$9Ajdgt93S.TUBGiUBzxblONsySouaOTpMWsorvNpmJVSWFoCl34.S', 'STUDENT', true, true, NOW(), NOW()),
('admin@internship.com', '$2a$10$9Ajdgt93S.TUBGiUBzxblONsySouaOTpMWsorvNpmJVSWFoCl34.S', 'ADMIN', true, true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password,
    role = EXCLUDED.role,
    is_active = true,
    is_verified = true;
