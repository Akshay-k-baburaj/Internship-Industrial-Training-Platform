# 🎓 Internship Industrial Training Platform - Backend

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-23-orange.svg)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive RESTful API backend for managing internships, industrial training, and campus placement activities built with Spring Boot, PostgreSQL, and JWT authentication.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Database Schema](#-database-schema)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (STUDENT, FACULTY, PLACEMENT_CELL, ADMIN)
- ✅ Password encryption with BCrypt
- ✅ Token refresh mechanism
- ✅ Secure session management

### 👥 User Management
- ✅ User registration and login
- ✅ Profile management
- ✅ Email verification
- ✅ Password reset functionality
- ✅ User activation/deactivation

### 🎯 Core Functionality
- ✅ **Students**: Profile creation, resume upload, skill management
- ✅ **Opportunities**: Internship and training postings
- ✅ **Applications**: Apply, track, and manage applications
- ✅ **Faculty**: Review and approve student applications
- ✅ **Placement Cell**: Manage opportunities and track placements

### 📊 Advanced Features
- ✅ File upload (Resume & Profile Images)
- ✅ Email notifications
- ✅ Search and filtering
- ✅ Pagination support
- ✅ Reporting and analytics
- ✅ Audit logging
- ✅ Rate limiting
- ✅ Soft delete
- ✅ CORS configuration

### 🛡️ Security Features
- ✅ Global exception handling
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure file upload

---

## 🚀 Tech Stack

### Core Technologies
- **Framework**: Spring Boot 4.0.0
- **Language**: Java 23
- **Database**: PostgreSQL
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven

### Security
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: BCrypt
- **Security Framework**: Spring Security

### Additional Libraries
- **Lombok**: Reduce boilerplate code
- **ModelMapper**: DTO conversions
- **Commons IO**: File operations
- **Bucket4j**: Rate limiting
- **JavaMailSender**: Email notifications
- **Springdoc OpenAPI**: API documentation

---

## 🏗️ Architecture

```
src/main/java/com/internship/portal/
├── config/                 # Configuration classes
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   ├── OpenApiConfig.java
│   └── ModelMapperConfig.java
├── security/              # Security components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetailsService.java
│   └── JwtAuthenticationEntryPoint.java
├── exception/             # Exception handling
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   ├── BadRequestException.java
│   ├── DuplicateResourceException.java
│   └── FileStorageException.java
├── dto/                   # Data Transfer Objects
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── AuthResponse.java
│   └── MessageResponse.java
├── service/               # Business logic
│   ├── AuthService.java
│   ├── EmailService.java
│   └── FileStorageService.java
├── user/                  # User module
├── student/               # Student module
├── faculty/               # Faculty module
├── placementcell/         # Placement cell module
└── opportunity/           # Opportunity module
    ├── application/       # Application sub-module
    ├── eligibility/       # Eligibility sub-module
    └── placementstatistics/ # Statistics sub-module
```

---

## 🎯 Getting Started

### Prerequisites
- Java 23 or higher
- PostgreSQL 12 or higher
- Maven 3.8+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Internship-Industrial-Training-Platform-main
```

2. **Create PostgreSQL database**
```sql
CREATE DATABASE internship_portal;
```

3. **Run the schema script**
```bash
psql -U postgres -d internship_portal -f Database/schema.sql
```

4. **Configure application.properties**
```properties
# Update these values
spring.datasource.url=jdbc:postgresql://localhost:5432/internship_portal
spring.datasource.username=your_username
spring.datasource.password=your_password

# Update email configuration (optional)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

5. **Build the project**
```bash
mvn clean install
```

6. **Run the application**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

---

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

### API Endpoints

#### Authentication Endpoints
```
POST   /api/v1/auth/register        - Register new user
POST   /api/v1/auth/login           - Login user
POST   /api/v1/auth/refresh-token   - Refresh access token
POST   /api/v1/auth/logout          - Logout user
GET    /api/v1/auth/me              - Get current user
GET    /api/v1/auth/validate        - Validate token
```

#### Student Endpoints
```
POST   /api/v1/students             - Create student profile
PUT    /api/v1/students/{id}        - Update student profile
GET    /api/v1/students/{id}        - Get student by ID
GET    /api/v1/students/user/{userId} - Get student by user ID
GET    /api/v1/students/roll/{rollNumber} - Get student by roll number
GET    /api/v1/students/department/{department} - Get students by department
GET    /api/v1/students/unplaced    - Get unplaced students
POST   /api/v1/students/upload-resume - Upload resume
POST   /api/v1/students/upload-profile - Upload profile image
```

#### Opportunity Endpoints
```
POST   /api/v1/opportunities        - Create opportunity
PUT    /api/v1/opportunities/{id}   - Update opportunity
DELETE /api/v1/opportunities/{id}   - Delete opportunity
GET    /api/v1/opportunities        - Get all opportunities
GET    /api/v1/opportunities/{id}   - Get opportunity by ID
GET    /api/v1/opportunities/placementcell/{userId} - Get opportunities by placement cell
```

#### Application Endpoints
```
POST   /api/v1/applications/apply   - Apply for opportunity
GET    /api/v1/applications/opportunity/{opportunityId} - Get applications for opportunity
GET    /api/v1/applications/student/{studentId} - Get applications by student
PUT    /api/v1/applications/{applicationId}/status - Update application status
PUT    /api/v1/applications/{applicationId}/faculty-approval - Faculty approval
GET    /api/v1/applications/pending-approvals - Get pending faculty approvals
```

---

## 🔒 Security

### JWT Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle
- **Access Token**: Expires in 24 hours
- **Refresh Token**: Expires in 7 days

### Password Requirements
- Minimum 6 characters
- Encrypted using BCrypt

### Role-Based Access Control

| Role | Permissions |
|------|------------|
| **STUDENT** | View opportunities, apply, manage own profile |
| **FACULTY** | Approve applications, view student details |
| **PLACEMENT_CELL** | Create opportunities, manage applications |
| **ADMIN** | Full system access |

---

## 🗄️ Database Schema

### Core Tables
- **users**: User authentication and roles
- **students**: Student profiles and details
- **faculty**: Faculty information
- **placement_cells**: Placement cell members
- **opportunities**: Internship/training opportunities
- **applications**: Student applications

### Relationships
- User (1) → (1) Student/Faculty/PlacementCell
- Opportunity (1) → (N) Applications
- Student (1) → (N) Applications
- Faculty (1) → (N) Application Approvals

See `Database/schema.sql` for complete schema.

---

## ⚙️ Configuration

### Application Properties

#### Database Configuration
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/internship_portal
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

#### JWT Configuration
```properties
jwt.secret=your-secret-key
jwt.expiration=86400000
jwt.refresh-expiration=604800000
```

#### File Upload Configuration
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload.dir=./uploads
```

#### Email Configuration
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.email.enabled=true
```

#### CORS Configuration
```properties
cors.allowed-origins=http://localhost:3000,http://localhost:5173
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS,PATCH
cors.allow-credentials=true
```

---

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Test Coverage
- Unit tests for services
- Integration tests for controllers
- Security tests for authentication

---

## 🚢 Deployment

### Using Docker (Recommended)

1. **Build Docker image**
```bash
docker build -t internship-portal-backend .
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

### Manual Deployment

1. **Build JAR file**
```bash
mvn clean package -DskipTests
```

2. **Run JAR**
```bash
java -jar target/placement-portal-0.0.1-SNAPSHOT.jar
```

### Environment Variables
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/internship_portal
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your-production-secret
```

---

## 📊 Monitoring & Logging

### Logging
Logs are stored in `logs/application.log`

### Log Levels
- **DEBUG**: Development
- **INFO**: Production
- **ERROR**: Critical issues

### Actuator Endpoints
```
GET /actuator/health    - Health check
GET /actuator/info      - Application info
GET /actuator/metrics   - Application metrics
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- Development Team

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- PostgreSQL Community
- JWT.io
- OpenAPI/Swagger

---

## 📞 Support

For support, email support@internshipportal.com or open an issue in the repository.

---

## 🔄 Version History

- **v1.0.0** (2026-02-04)
  - Initial release
  - JWT authentication
  - Complete CRUD operations
  - File upload support
  - Email notifications
  - Comprehensive security

---

**Made with ❤️ by the Development Team**
