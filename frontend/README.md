# Internship & Placement Platform - Developer Handover

## 🚀 Project Overview
This platform manages the end-to-end placement process, including student applications, faculty approvals, and placement cell verification. This update completes the core **Faculty Module**, **Placement Dashboard Stats**, and **Placement Verification** workflows.

---

## 📂 Frontend Architecture & Handover (`/frontend/src`)

### **1. Page Components (`/pages`)**
Organized by module. Each module contains pages specific to that user role.

#### **Faculty Module (`/pages/faculty`)**
*   **`FacultyDashboard.jsx`**: Main landing page. Shows real-time stats (Pending Approvals, Reviewed Count, Unplaced Count) and Quick Actions.
*   **`PendingApprovals.jsx`**: Table of applications waiting for review. Includes "Approve/Reject" buttons.
*   **`ReviewApplication.jsx`**: Detailed view of a single application (Student Profile + Opportunity Details + Action Buttons).
*   **`ReviewedStudents.jsx`**: accessible from Dashboard "Reviewed" card. Lists unique students processed by this faculty.
*   **`FacultyProfile.jsx`**: View and Edit faculty personal details.
*   **`PlacementVerification.jsx`**: (Shared/Admin focus) Table for verifying placed students. **Critical Effect**: Marking "Placed" here auto-rejects other applications for that student.
*   **`FacultyGlobal.css`**: Shared styles specific to faculty pages.

#### **Placement Module (`/pages/placement`)**
*   **`PlacementDashboard.jsx`**: Admin dashboard. Stats for Opportunities, Applications, Placed Students, Acceptance Rate.
*   **`CreateOpportunity.jsx`**: Form to post new jobs. Includes rich text description.
*   **`EditOpportunity.jsx`**: Form to edit existing jobs. Pre-fills data.
*   **`StudentDirectory.jsx`**: Master list of all students. Filters by Passout Year, Department, Placed Status.
*   **`PlacementAnalytics.jsx`**: Charts & Visualizations (using `recharts`) for placement trends.
*   **`PlacementStatistics.jsx`**: (Legacy/Helper) Statistics view.
*   **`PlacementGlobal.css`**: Shared styles for admin pages.

#### **Student Module (`/pages/student`)**
*   **`StudentDashboard.jsx`**: Student home. Shows Applied Jobs count, Profile completeness, Recommended jobs.
*   **`StudentOpportunities.jsx`**: List of all available opportunities. "Apply" button changes to "Applied" status dynamically.
*   **`OpportunityDetails.jsx`**: Full job description view.
*   **`StudentApplications.jsx`**: History of applications with status badges (Applied, Selected, Rejected).
*   **`UnplacedStudents.jsx`**: Directory of students explicitly NOT placed. Used by Faculty to identify students needing help.
*   **`StudentProfile.jsx`**: Student's own profile view/edit.

---

### **2. Services (`/services`)**
Axios-based API wrappers. All backend calls go through here.

*   **`api.js`**: Axios instance with base URL configuration. available for all services.
*   **`authService.js`**: Login/Register endpoints.
*   **`applicationService.js`**: Handles application lifecycle (`apply`, `updateStatus`, `verifyPlacement`, `getPending`, `getReviewed`).
*   **`facultyService.js`**: Faculty specific data (`getProfile`, `updateProfile`, `getDashboardStats`).
*   **`studentService.js`**: Student data (`getAll`, `getUnplaced`, `getByDept`).
*   **`opportunityService.js`**: CRUD for Opportunities (`create`, `getAll`, `getById`, `update`).
*   **`statisticsService.js`**: Fetches aggregate data for Dashboard charts.

---

### **3. Routing (`/routes`)**
*   **`AppRoutes.jsx`**: Central routing file. Maps URL paths to Components.
    *   `/faculty/*`: Faculty pages.
    *   `/placement/*`: Admin pages.
    *   `/student/*`: Student pages.
*   **`ProtectedRoute.jsx`**: (To implement) Wrapper to check if user is logged in before rendering sensitive routes.

---

### **4. Utilities (`/utils`)**
*   **`mockAuth.js`**: **CRITICAL FOR DEV**. Contains hardcoded IDs to simulate logged-in users since full Auth isn't fully integrated on frontend.
    *   `MOCK_USER_ID`: ID of the Faculty currently "logged in". Change this to test different faculty views.
    *   `MOCK_STUDENT_ID`: ID of the Student currently "logged in".
    *   `MOCK_PLACEMENT_USER_ID`: ID of the Admin.
*   **`FacultyAuthGuard.jsx`**: Wrapper to ensure only authorized faculty can access certain routes (basic check).

---

### **5. Assets (`/assets`)**
*   Images, Logos, Vectors.
*   `react.svg`: default react logo.

---

---

## 🛠️ Data Seeding (SQL Queries)
Run these in your MySQL database to popualte test data.

### **0. ⚠️ CRITICAL: Database Schema Updates**
Before inserting data, ensure the `opportunities` table supports the new types ('PLACEMENT', 'INTERNSHIP').
```sql
-- Fixes "Data truncated" or "Invalid Enum" errors for the 'type' column
ALTER TABLE opportunities MODIFY COLUMN type VARCHAR(50);
```

### **1. Add Test Faculty Users**
```sql
-- Adds 4 Faculty Users with password 'password' hash (approximate)
INSERT INTO users (email, password, role, is_active, created_at, updated_at) VALUES 
('rakesh.gupta@college.edu', '$2a$10$GRLdNghb986kq90K7UBex.9.a.j.d.s.f.g.h', 'FACULTY', true, NOW(), NOW()),
('anita.deshmukh@college.edu', '$2a$10$GRLdNghb986kq90K7UBex.9.a.j.d.s.f.g.h', 'FACULTY', true, NOW(), NOW()),
('suresh.nair@college.edu', '$2a$10$GRLdNghb986kq90K7UBex.9.a.j.d.s.f.g.h', 'FACULTY', true, NOW(), NOW()),
('meera.iyer@college.edu', '$2a$10$GRLdNghb986kq90K7UBex.9.a.j.d.s.f.g.h', 'FACULTY', true, NOW(), NOW());

-- Link to Faculty Profile Tables
INSERT INTO faculty (user_id, employee_id, full_name, department, designation, phone, created_at, updated_at)
SELECT id, 'EMP001', 'Dr. Rakesh Gupta', 'CSE', 'Professor', '9876500001', NOW(), NOW() FROM users WHERE email = 'rakesh.gupta@college.edu';

INSERT INTO faculty (user_id, employee_id, full_name, department, designation, phone, created_at, updated_at)
SELECT id, 'EMP002', 'Prof. Anita Deshmukh', 'IT', 'Assistant Professor', '9876500002', NOW(), NOW() FROM users WHERE email = 'anita.deshmukh@college.edu';
```

### **2. Add Test Students**
```sql
-- Adds 4 Student Users
INSERT INTO users (email, password, role, is_active, created_at, updated_at) VALUES 
('arjun.sharma@example.com', '$2a$10$GRLdNghb986kq90K7UBex.9.a.j.d.s.f.g.h', 'STUDENT', true, NOW(), NOW()),
('priya.patel@example.com', '$2a$10$GRLdNghb986kq90K7UBex.9.a.j.d.s.f.g.h', 'STUDENT', true, NOW(), NOW());

-- Link to Student Profile Tables
INSERT INTO students (user_id, full_name, roll_number, department, semester, cgpa, is_placed, created_at, updated_at)
SELECT id, 'Arjun Sharma', 'CSE2024001', 'CSE', 7, 8.50, false, NOW(), NOW() FROM users WHERE email = 'arjun.sharma@example.com';

INSERT INTO students (user_id, full_name, roll_number, department, semester, cgpa, is_placed, created_at, updated_at)
SELECT id, 'Priya Patel', 'IT2024002', 'IT', 7, 7.80, false, NOW(), NOW() FROM users WHERE email = 'priya.patel@example.com';
```

### **3. Add Test Application (Pending Review)**
```sql
-- Ensure Opportunity Exists
INSERT INTO opportunities (title, company_name, type, eligible_departments, posted_by_id, created_at, updated_at)
SELECT 'Full Stack Intern', 'Tech Corp', 'INTERNSHIP', 'CSE,IT', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM opportunities WHERE id = 1);

-- Apply for CSE Student (Pending Faculty Approval)
INSERT INTO applications (student_id, opportunity_id, status, faculty_approval_status, applied_at, updated_at)
SELECT s.id, o.id, 'APPLIED', 'PENDING', NOW(), NOW()
FROM students s, opportunities o
WHERE s.department = 'CSE' AND o.title = 'Full Stack Intern' LIMIT 1;
```

---

## 👨‍💻 Developer Notes (Next Steps)
1.  **Authentication**:
    *   Currently, `mockAuth.js` controls the logged-in user.
    *   **To test Faculty**: Set `MOCK_USER_ID = 8` (or whatever ID your SQL generated for `rakesh.gupta` - check your DB users table!).
    *   **To test Student**: Set `MOCK_STUDENT_ID`.
2.  **Styling**:
    *   Most pages use `PlacementGlobal.css` or `FacultyGlobal.css`.
    *   Ensure new pages import these for consistent "Premium" look.
3.  **Missing Features**:
    *   The "View Profile" button in `ReviewedStudents.jsx` is a placeholder (`alert`). Needs to link to a student profile view.
    *   Real Authentication (JWT) is not fully wired into the frontend state yet properly; rely on `mockAuth.js` for now.

**Good Luck!** 🚀
