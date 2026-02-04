# 📘 API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Response:** `201 Created`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "student@example.com",
  "role": "STUDENT",
  "expiresIn": 86400000
}
```

---

### Login
**POST** `/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "student@example.com",
  "role": "STUDENT",
  "expiresIn": 86400000
}
```

---

### Refresh Token
**POST** `/auth/refresh-token`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "student@example.com",
  "role": "STUDENT",
  "expiresIn": 86400000
}
```

---

### Get Current User
**GET** `/auth/me`

Get currently authenticated user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "student@example.com",
  "role": "STUDENT",
  "isActive": true,
  "isVerified": false,
  "createdAt": "2026-02-04T07:00:00",
  "updatedAt": "2026-02-04T07:00:00"
}
```

---

### Logout
**POST** `/auth/logout`

Logout current user (client should delete tokens).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## 👨‍🎓 Student Endpoints

### Create Student Profile
**POST** `/students`

Create a new student profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": 1,
  "rollNumber": "CS2024001",
  "fullName": "John Doe",
  "department": "Computer Science",
  "semester": 6,
  "cgpa": 8.5,
  "dateOfBirth": "2002-05-15",
  "phone": "9876543210",
  "skills": "Java, Python, React, Spring Boot",
  "resumeUrl": "resume_1_uuid.pdf",
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "portfolioUrl": "https://johndoe.dev"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "rollNumber": "CS2024001",
  "fullName": "John Doe",
  "department": "Computer Science",
  "semester": 6,
  "cgpa": 8.5,
  "dateOfBirth": "2002-05-15",
  "phone": "9876543210",
  "skills": "Java, Python, React, Spring Boot",
  "resumeUrl": "resume_1_uuid.pdf",
  "isPlaced": false,
  "createdAt": "2026-02-04T07:00:00",
  "updatedAt": "2026-02-04T07:00:00"
}
```

---

### Upload Resume
**POST** `/students/upload-resume`

Upload student resume (PDF, DOC, DOCX only, max 10MB).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
file: <resume-file>
studentId: 1
```

**Response:** `200 OK`
```json
{
  "message": "Resume uploaded successfully",
  "fileName": "resume_1_uuid.pdf",
  "fileUrl": "/uploads/resumes/resume_1_uuid.pdf"
}
```

---

### Upload Profile Image
**POST** `/students/upload-profile`

Upload student profile image (JPG, PNG, GIF only, max 10MB).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
file: <image-file>
studentId: 1
```

**Response:** `200 OK`
```json
{
  "message": "Profile image uploaded successfully",
  "fileName": "profile_1_uuid.jpg",
  "fileUrl": "/uploads/profiles/profile_1_uuid.jpg"
}
```

---

### Get Student by ID
**GET** `/students/{id}`

Get student details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "rollNumber": "CS2024001",
  "fullName": "John Doe",
  "department": "Computer Science",
  "semester": 6,
  "cgpa": 8.5,
  "isPlaced": false
}
```

---

### Get Unplaced Students
**GET** `/students/unplaced`

Get list of all unplaced students.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "rollNumber": "CS2024001",
    "fullName": "John Doe",
    "department": "Computer Science",
    "cgpa": 8.5,
    "isPlaced": false
  }
]
```

---

## 💼 Opportunity Endpoints

### Create Opportunity
**POST** `/opportunities`

Create a new internship/training opportunity.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Software Development Intern",
  "description": "Looking for talented interns...",
  "companyName": "Tech Corp",
  "type": "INTERNSHIP",
  "requiredSkills": "Java, Spring Boot, React",
  "requiredCgpa": 7.0,
  "eligibleDepartments": "Computer Science, IT",
  "stipend": 15000,
  "duration": "6 months",
  "location": "Bangalore",
  "workMode": "HYBRID",
  "deadline": "2026-03-15",
  "numberOfOpenings": 5
}
```

**Query Parameters:**
```
postedById: 1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Software Development Intern",
  "companyName": "Tech Corp",
  "type": "INTERNSHIP",
  "stipend": 15000,
  "deadline": "2026-03-15",
  "isActive": true,
  "createdAt": "2026-02-04T07:00:00"
}
```

---

### Get All Opportunities
**GET** `/opportunities`

Get list of all active opportunities (Public endpoint).

**Query Parameters (Optional):**
```
page: 0
size: 10
department: Computer Science
type: INTERNSHIP
```

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "title": "Software Development Intern",
      "companyName": "Tech Corp",
      "type": "INTERNSHIP",
      "stipend": 15000,
      "location": "Bangalore",
      "deadline": "2026-03-15"
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### Search Opportunities
**GET** `/opportunities/search`

Search opportunities by keyword.

**Query Parameters:**
```
keyword: java developer
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Java Developer Intern",
    "companyName": "Tech Solutions",
    "type": "INTERNSHIP"
  }
]
```

---

## 📝 Application Endpoints

### Apply for Opportunity
**POST** `/applications/apply`

Submit application for an opportunity.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
studentId: 1
opportunityId: 1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "studentId": 1,
  "opportunityId": 1,
  "status": "APPLIED",
  "facultyApprovalStatus": "PENDING",
  "appliedAt": "2026-02-04T07:00:00"
}
```

---

### Get Student Applications
**GET** `/applications/student/{studentId}`

Get all applications submitted by a student.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "opportunityTitle": "Software Development Intern",
    "companyName": "Tech Corp",
    "status": "APPLIED",
    "facultyApprovalStatus": "PENDING",
    "appliedAt": "2026-02-04T07:00:00"
  }
]
```

---

### Faculty Approval
**PUT** `/applications/{applicationId}/faculty-approval`

Approve or reject student application.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
facultyId: 1
approved: true
remarks: "Good academic record"
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "APPLIED",
  "facultyApprovalStatus": "APPROVED",
  "approvedByFaculty": 1,
  "remarks": "Good academic record",
  "updatedAt": "2026-02-04T08:00:00"
}
```

---

### Update Application Status
**PUT** `/applications/{applicationId}/status`

Update application status (Placement Cell only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
status: SELECTED
placementCellId: 1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "SELECTED",
  "updatedAt": "2026-02-04T09:00:00"
}
```

---

## 📊 Statistics & Reports

### Placement Statistics
**GET** `/statistics/placement`

Get overall placement statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "totalStudents": 500,
  "placedStudents": 350,
  "placementPercentage": 70.0,
  "totalOpportunities": 100,
  "activeOpportunities": 25,
  "totalApplications": 1500,
  "approvedApplications": 800
}
```

---

### Department-wise Statistics
**GET** `/statistics/department/{department}`

Get placement statistics for a specific department.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "department": "Computer Science",
  "totalStudents": 150,
  "placedStudents": 120,
  "placementPercentage": 80.0,
  "averageStipend": 18000
}
```

---

## ❌ Error Responses

All error responses follow this format:

```json
{
  "timestamp": "2026-02-04T07:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with id: '999'",
  "path": "/api/v1/students/999"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 413 | Payload Too Large |
| 500 | Internal Server Error |

---

## 🔍 Validation Errors

Validation errors return detailed field-level errors:

```json
{
  "timestamp": "2026-02-04T07:00:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed",
  "path": "/api/v1/auth/register",
  "details": [
    "email: Email should be valid",
    "password: Password must be at least 6 characters"
  ]
}
```

---

## 📌 Notes

1. All timestamps are in ISO 8601 format
2. Pagination starts from page 0
3. Default page size is 10, maximum is 100
4. File uploads limited to 10MB
5. JWT tokens expire in 24 hours
6. Refresh tokens expire in 7 days
7. Rate limit: 60 requests per minute per IP

---

**For more details, visit Swagger UI at:** `http://localhost:8080/swagger-ui.html`
