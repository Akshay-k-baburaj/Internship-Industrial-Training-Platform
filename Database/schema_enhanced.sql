-- =========================================
-- INTERNSHIP INDUSTRIAL TRAINING PLATFORM
-- Enhanced Database Schema with All Features
-- Version: 2.0
-- Date: 2026-02-04
-- =========================================

-- =========================================
-- 1. USERS TABLE (Enhanced with Soft Delete)
-- =========================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'PLACEMENT_CELL', 'ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Soft Delete
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted ON users(deleted);

-- =========================================
-- 2. USER NOTIFICATION PREFERENCES
-- =========================================
CREATE TABLE user_notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    application_updates BOOLEAN DEFAULT TRUE,
    new_opportunities BOOLEAN DEFAULT TRUE,
    faculty_approvals BOOLEAN DEFAULT TRUE,
    system_announcements BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 3. PLACEMENT CELLS (Enhanced)
-- =========================================
CREATE TABLE placement_cells (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Soft Delete
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_placement_cells_deleted ON placement_cells(deleted);

-- =========================================
-- 4. STUDENTS (Enhanced)
-- =========================================
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INTEGER CHECK (semester BETWEEN 1 AND 10),
    cgpa DECIMAL(3,2) CHECK (cgpa BETWEEN 0 AND 10),
    date_of_birth DATE,
    phone VARCHAR(15),

    -- Profile & Skills
    skills TEXT,
    resume_url VARCHAR(500),
    profile_image_url VARCHAR(500),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),

    -- Placement Status
    is_placed BOOLEAN DEFAULT FALSE,
    placement_company VARCHAR(255),
    placement_date DATE,
    
    -- Soft Delete
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_department ON students(department);
CREATE INDEX idx_students_cgpa ON students(cgpa);
CREATE INDEX idx_students_placed ON students(is_placed);
CREATE INDEX idx_students_deleted ON students(deleted);

-- =========================================
-- 5. FACULTY (Enhanced)
-- =========================================
CREATE TABLE faculty (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    phone VARCHAR(15),
    
    -- Soft Delete
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_faculty_department ON faculty(department);
CREATE INDEX idx_faculty_deleted ON faculty(deleted);

-- =========================================
-- 6. OPPORTUNITIES (Enhanced)
-- =========================================
CREATE TABLE opportunities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('INTERNSHIP', 'INDUSTRIAL_TRAINING', 'PLACEMENT')),
    required_skills TEXT NOT NULL,
    required_cgpa DECIMAL(3,2) CHECK (required_cgpa BETWEEN 0 AND 10),
    eligible_departments TEXT,
    stipend INTEGER,
    duration VARCHAR(50),
    location VARCHAR(255),
    work_mode VARCHAR(50) CHECK (work_mode IN ('ONSITE', 'REMOTE', 'HYBRID')),
    deadline DATE NOT NULL,
    number_of_openings INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    posted_by BIGINT NOT NULL,
    
    -- Additional Fields
    company_website VARCHAR(255),
    application_link VARCHAR(500),
    
    -- Soft Delete
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    
    FOREIGN KEY (posted_by) REFERENCES users(id)
);

CREATE INDEX idx_opportunities_company ON opportunities(company_name);
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX idx_opportunities_active ON opportunities(is_active);
CREATE INDEX idx_opportunities_deleted ON opportunities(deleted);

-- =========================================
-- 7. APPLICATIONS (Enhanced)
-- =========================================
CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    opportunity_id BIGINT NOT NULL,

    status VARCHAR(50) DEFAULT 'APPLIED'
        CHECK (status IN ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'APPROVED', 'REJECTED', 'SELECTED', 'WITHDRAWN')),

    faculty_approval_status VARCHAR(50) DEFAULT 'PENDING'
        CHECK (faculty_approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),

    approved_by_faculty BIGINT,
    remarks TEXT,
    
    -- Additional Fields
    cover_letter TEXT,
    expected_joining_date DATE,
    
    -- Soft Delete
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,

    -- Audit Fields
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_faculty) REFERENCES faculty(id),

    UNIQUE(student_id, opportunity_id)
);

CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_opportunity ON applications(opportunity_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_faculty_status ON applications(faculty_approval_status);
CREATE INDEX idx_applications_deleted ON applications(deleted);

-- =========================================
-- 8. AUDIT LOG TABLE
-- =========================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- =========================================
-- 9. EMAIL NOTIFICATIONS LOG
-- =========================================
CREATE TABLE email_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    email_to VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    notification_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_email_notifications_user ON email_notifications(user_id);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_email_notifications_created ON email_notifications(created_at);

-- =========================================
-- 10. FILE UPLOADS TABLE
-- =========================================
CREATE TABLE file_uploads (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    original_file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    upload_type VARCHAR(50) CHECK (upload_type IN ('RESUME', 'PROFILE_IMAGE', 'DOCUMENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_file_uploads_user ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_type ON file_uploads(upload_type);

-- =========================================
-- 11. PLACEMENT STATISTICS (Materialized View)
-- =========================================
CREATE MATERIALIZED VIEW placement_statistics AS
SELECT 
    s.department,
    COUNT(DISTINCT s.id) as total_students,
    COUNT(DISTINCT CASE WHEN s.is_placed = TRUE THEN s.id END) as placed_students,
    ROUND(
        (COUNT(DISTINCT CASE WHEN s.is_placed = TRUE THEN s.id END)::DECIMAL / 
        NULLIF(COUNT(DISTINCT s.id), 0) * 100), 2
    ) as placement_percentage,
    AVG(o.stipend) as average_stipend,
    COUNT(DISTINCT a.id) as total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.id END) as successful_applications
FROM students s
LEFT JOIN applications a ON s.id = a.student_id AND a.deleted = FALSE
LEFT JOIN opportunities o ON a.opportunity_id = o.id AND o.deleted = FALSE
WHERE s.deleted = FALSE
GROUP BY s.department;

CREATE INDEX idx_placement_stats_dept ON placement_statistics(department);

-- =========================================
-- 12. REFRESH TOKENS TABLE
-- =========================================
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expiry ON refresh_tokens(expiry_date);

-- =========================================
-- FUNCTIONS AND TRIGGERS
-- =========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_placement_cells_updated_at BEFORE UPDATE ON placement_cells
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- SEED DATA (Optional - for testing)
-- =========================================

-- Insert Admin User (password: admin123 - BCrypt hashed)
INSERT INTO users (email, password, role, is_active, is_verified) VALUES
('admin@internship.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', TRUE, TRUE);

-- Insert default notification preferences for admin
INSERT INTO user_notification_preferences (user_id) VALUES (1);

-- =========================================
-- VIEWS FOR REPORTING
-- =========================================

-- Active Opportunities View
CREATE VIEW active_opportunities AS
SELECT 
    o.*,
    u.email as posted_by_email,
    COUNT(a.id) as total_applications
FROM opportunities o
JOIN users u ON o.posted_by = u.id
LEFT JOIN applications a ON o.id = a.opportunity_id AND a.deleted = FALSE
WHERE o.deleted = FALSE AND o.is_active = TRUE
GROUP BY o.id, u.email;

-- Student Application Summary View
CREATE VIEW student_application_summary AS
SELECT 
    s.id as student_id,
    s.full_name,
    s.roll_number,
    s.department,
    COUNT(a.id) as total_applications,
    COUNT(CASE WHEN a.status = 'APPLIED' THEN 1 END) as pending_applications,
    COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) as selected_applications,
    COUNT(CASE WHEN a.status = 'REJECTED' THEN 1 END) as rejected_applications
FROM students s
LEFT JOIN applications a ON s.id = a.student_id AND a.deleted = FALSE
WHERE s.deleted = FALSE
GROUP BY s.id, s.full_name, s.roll_number, s.department;

-- =========================================
-- COMMENTS FOR DOCUMENTATION
-- =========================================

COMMENT ON TABLE users IS 'Core user authentication and authorization table';
COMMENT ON TABLE students IS 'Student profiles with academic and placement information';
COMMENT ON TABLE faculty IS 'Faculty members who approve student applications';
COMMENT ON TABLE placement_cells IS 'Placement cell members who manage opportunities';
COMMENT ON TABLE opportunities IS 'Internship and training opportunities posted by placement cell';
COMMENT ON TABLE applications IS 'Student applications for opportunities';
COMMENT ON TABLE audit_logs IS 'System-wide audit trail for all important actions';
COMMENT ON TABLE email_notifications IS 'Email notification queue and history';
COMMENT ON TABLE file_uploads IS 'Metadata for all uploaded files';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for authentication';
COMMENT ON TABLE user_notification_preferences IS 'User preferences for email and in-app notifications';

-- =========================================
-- END OF SCHEMA
-- =========================================
