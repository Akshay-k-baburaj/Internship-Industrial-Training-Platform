-- =========================================
-- 1. USERS
-- =========================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'PLACEMENT_CELL', 'ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =========================================
-- 2. PLACEMENT CELLS
-- =========================================
CREATE TABLE placement_cells (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 3. STUDENTS
-- =========================================
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INTEGER CHECK (semester BETWEEN 1 AND 10),
    cgpa DECIMAL(3,2),
    date_of_birth DATE,
    phone VARCHAR(15),

    -- Profile & Skills
    skills TEXT,
    resume_url VARCHAR(500) NOT NULL,
    profile_image_url VARCHAR(500),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),

    -- Placement Status
    is_placed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_department ON students(department);
CREATE INDEX idx_students_cgpa ON students(cgpa);

-- =========================================
-- 4. FACULTY
-- =========================================
CREATE TABLE faculty (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 5. OPPORTUNITIES
-- =========================================
CREATE TABLE opportunities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('INTERNSHIP', 'INDUSTRIAL_TRAINING')),
    required_skills TEXT NOT NULL,
    required_cgpa DECIMAL(3,2),
    eligible_departments TEXT,
    stipend INTEGER,
    duration VARCHAR(50),
    location VARCHAR(255),
    work_mode VARCHAR(50) CHECK (work_mode IN ('ONSITE', 'REMOTE', 'HYBRID')),
    deadline DATE NOT NULL,
    number_of_openings INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    posted_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- =========================================
-- 6. APPLICATIONS
-- =========================================
CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    opportunity_id BIGINT NOT NULL,

    status VARCHAR(50) DEFAULT 'APPLIED'
        CHECK (status IN ('APPLIED', 'APPROVED', 'REJECTED', 'SELECTED')),

    faculty_approval_status VARCHAR(50) DEFAULT 'PENDING'
        CHECK (faculty_approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),

    approved_by_faculty BIGINT,
    remarks TEXT,

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_faculty) REFERENCES faculty(id),

    UNIQUE(student_id, opportunity_id)
);
