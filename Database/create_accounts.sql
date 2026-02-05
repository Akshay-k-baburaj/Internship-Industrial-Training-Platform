-- Password for all accounts is: password123
-- Valid Hash generated from running backend: $2a$10$C4s9LM9EezVDoE5734yoi.5WuB6MVSpsO/EnETV2o5.3ch6bBc2yS

-- ==========================================
-- CLEANUP: Delete existing seed users to ensure fresh insert
-- ==========================================
DELETE FROM users WHERE email IN (
    'placement@college.edu',
    'faculty.mca@college.edu',
    'faculty.cse@college.edu',
    'faculty.it@college.edu'
);

-- ==========================================
-- 1. Create Placement Cell User
-- ==========================================
INSERT INTO users (email, password, role, is_active, is_verified, created_at, updated_at)
VALUES ('placement@college.edu', '$2a$10$C4s9LM9EezVDoE5734yoi.5WuB6MVSpsO/EnETV2o5.3ch6bBc2yS', 'PLACEMENT_CELL', true, true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Link Placement Cell Profile
INSERT INTO placement_cells (user_id, employee_id, full_name, is_active, created_at, updated_at)
SELECT id, 'PC001', 'Chief Placement Officer', true, NOW(), NOW()
FROM users WHERE email = 'placement@college.edu'
ON CONFLICT (user_id) DO NOTHING;


-- ==========================================
-- 2. Create Faculty User (MCA)
-- ==========================================
INSERT INTO users (email, password, role, is_active, is_verified, created_at, updated_at)
VALUES ('faculty.mca@college.edu', '$2a$10$C4s9LM9EezVDoE5734yoi.5WuB6MVSpsO/EnETV2o5.3ch6bBc2yS', 'FACULTY', true, true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Link Faculty Profile (MCA)
INSERT INTO faculty (user_id, employee_id, full_name, department, designation, phone, created_at, updated_at)
SELECT id, 'FAC001', 'Prof. MCA Head', 'MCA', 'Head of Department', '9876543210', NOW(), NOW()
FROM users WHERE email = 'faculty.mca@college.edu'
ON CONFLICT (user_id) DO NOTHING;


-- ==========================================
-- 3. Create Faculty User (CSE)
-- ==========================================
INSERT INTO users (email, password, role, is_active, is_verified, created_at, updated_at)
VALUES ('faculty.cse@college.edu', '$2a$10$C4s9LM9EezVDoE5734yoi.5WuB6MVSpsO/EnETV2o5.3ch6bBc2yS', 'FACULTY', true, true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Link Faculty Profile (CSE)
INSERT INTO faculty (user_id, employee_id, full_name, department, designation, phone, created_at, updated_at)
SELECT id, 'FAC002', 'Prof. CSE Head', 'CSE', 'Assistant Professor', '9876543211', NOW(), NOW()
FROM users WHERE email = 'faculty.cse@college.edu'
ON CONFLICT (user_id) DO NOTHING;


-- ==========================================
-- 4. Create Faculty User (IT)
-- ==========================================
INSERT INTO users (email, password, role, is_active, is_verified, created_at, updated_at)
VALUES ('faculty.it@college.edu', '$2a$10$C4s9LM9EezVDoE5734yoi.5WuB6MVSpsO/EnETV2o5.3ch6bBc2yS', 'FACULTY', true, true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Link Faculty Profile (IT)
INSERT INTO faculty (user_id, employee_id, full_name, department, designation, phone, created_at, updated_at)
SELECT id, 'FAC003', 'Prof. IT Head', 'IT', 'Senior Lecturer', '9876543212', NOW(), NOW()
FROM users WHERE email = 'faculty.it@college.edu'
ON CONFLICT (user_id) DO NOTHING;
