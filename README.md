# Internship & Industrial Training Platform

A comprehensive campus management system built with Spring Boot for managing internships and industrial training opportunities. This platform facilitates seamless interaction between students, faculty, and placement cells for opportunity discovery, application management, and placement tracking.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **User Management**: Multi-role authentication system supporting Students, Faculty, Placement Cell, and Admin roles
- **Opportunity Management**: Create, update, and manage internship and industrial training opportunities
- **Application System**: Students can apply for opportunities with faculty approval workflow
- **Eligibility Checking**: Automated eligibility verification based on CGPA, department, and skills
- **Placement Statistics**: Track and analyze placement data and statistics
- **Profile Management**: Comprehensive student profiles with skills, resume, and portfolio links

### Key Capabilities
- **Opportunity Types**: Support for both Internships and Industrial Training programs
- **Work Modes**: Onsite, Remote, and Hybrid work arrangements
- **Application Status Tracking**: Track applications through Applied → Approved → Selected workflow
- **Faculty Approval**: Faculty members can approve or reject student applications
- **Department-based Filtering**: Filter opportunities by department eligibility
- **CGPA-based Eligibility**: Set minimum CGPA requirements for opportunities

## 🛠 Technology Stack

- **Framework**: Spring Boot 4.0.0
- **Language**: Java 23
- **Build Tool**: Maven
- **Database**: PostgreSQL (Production), H2 (Development/Testing)
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security
- **API Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Utilities**: Lombok
- **Validation**: Spring Boot Validation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 23 or higher
- **Maven**: Version 3.6+ (or use the included Maven Wrapper)
- **PostgreSQL**: Version 12+ (for production database)
- **Git**: For version control
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code (recommended)

### System Requirements
- **Operating System**: Windows, Linux, or macOS
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Disk Space**: At least 500MB free space

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Internship-Industrial-Training-Platform.git
cd Internship-Industrial-Training-Platform
```

### 2. Database Setup

#### Option A: Using PostgreSQL (Recommended for Production)

1. Install PostgreSQL if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE internship_portal;
   ```

3. Run the schema script:
   ```bash
   psql -U postgres -d internship_portal -f Database/schema.sql
   ```

#### Option B: Using H2 (For Development/Testing)

H2 database is included as a dependency and can be used for quick testing without PostgreSQL setup.

### 3. Configure Application Properties

1. Copy the example configuration file:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

2. Edit `src/main/resources/application.properties` and update the following:
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/internship_portal
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_DATABASE_PASSWORD_HERE
   
   # Server Port (default: 8080)
   server.port=8080
   ```

### 4. Build the Project

Using Maven Wrapper (recommended):
```bash
# On Windows
mvnw.cmd clean install

# On Linux/macOS
./mvnw clean install
```

Or using Maven directly:
```bash
mvn clean install
```

### 5. Run the Application

Using Maven Wrapper:
```bash
# On Windows
mvnw.cmd spring-boot:run

# On Linux/macOS
./mvnw spring-boot:run
```

Or using Maven directly:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 🗄 Database Configuration

### Database Schema

The database consists of the following main tables:

- **users**: User authentication and role management
- **students**: Student profiles and academic information
- **faculty**: Faculty member information
- **placement_cells**: Placement cell staff information
- **opportunities**: Internship and training opportunities
- **applications**: Student applications for opportunities

### Schema Details

See `Database/schema.sql` for the complete database schema including:
- Table definitions
- Foreign key relationships
- Indexes for performance optimization
- Check constraints for data validation

## 🏃 Running the Application

### Development Mode

The application includes Spring Boot DevTools for hot-reloading during development. Simply start the application and changes will be automatically reflected.

### Production Mode

1. Build the JAR file:
   ```bash
   mvn clean package
   ```

2. Run the JAR:
   ```bash
   java -jar target/placement-portal-0.0.1-SNAPSHOT.jar
   ```

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### API Endpoints Overview

#### Authentication
- `POST /api/auth/register` - Register a new user
- `GET /api/auth/user/{id}` - Get user by ID

#### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/{id}` - Get opportunity by ID
- `POST /api/opportunities` - Create a new opportunity
- `PUT /api/opportunities/{id}` - Update an opportunity
- `DELETE /api/opportunities/{id}` - Delete an opportunity
- `GET /api/opportunities/placementcell/{userId}` - Get opportunities by placement cell

#### Applications
- Endpoints for managing student applications (see Swagger UI for details)

#### Students
- Endpoints for student profile management (see Swagger UI for details)

#### Faculty
- Endpoints for faculty operations (see Swagger UI for details)

#### Placement Statistics
- Endpoints for placement statistics and analytics (see Swagger UI for details)

## 📁 Project Structure

```
Internship-Industrial-Training-Platform/
│
├── Database/
│   └── schema.sql                 # Database schema definition
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/internship/portal/
│   │   │       ├── config/
│   │   │       │   └── SecurityConfig.java      # Security configuration
│   │   │       │
│   │   │       ├── user/
│   │   │       │   ├── User.java                # User entity
│   │   │       │   ├── Role.java                # Role enum
│   │   │       │   ├── UserRepository.java      # User repository
│   │   │       │   ├── UserService.java         # User business logic
│   │   │       │   └── AuthController.java      # Authentication endpoints
│   │   │       │
│   │   │       ├── student/
│   │   │       │   ├── Student.java             # Student entity
│   │   │       │   ├── StudentDTO.java         # Student DTO
│   │   │       │   ├── StudentRepository.java  # Student repository
│   │   │       │   ├── StudentService.java     # Student business logic
│   │   │       │   └── StudentController.java  # Student endpoints
│   │   │       │
│   │   │       ├── faculty/
│   │   │       │   ├── Faculty.java            # Faculty entity
│   │   │       │   ├── FacultyDTO.java         # Faculty DTO
│   │   │       │   ├── FacultyRepository.java  # Faculty repository
│   │   │       │   └── FacultyService.java     # Faculty business logic
│   │   │       │
│   │   │       ├── placementcell/
│   │   │       │   ├── PlacementCell.java      # Placement cell entity
│   │   │       │   ├── PlacementCellDTO.java   # Placement cell DTO
│   │   │       │   ├── PlacementCellRepository.java
│   │   │       │   └── PlacementCellService.java
│   │   │       │
│   │   │       ├── opportunity/
│   │   │       │   ├── Opportunity.java        # Opportunity entity
│   │   │       │   ├── OpportunityDTO.java     # Opportunity DTO
│   │   │       │   ├── OpportunityRepository.java
│   │   │       │   ├── OpportunityService.java
│   │   │       │   ├── OpportunityController.java
│   │   │       │   │
│   │   │       │   ├── application/
│   │   │       │   │   ├── Application.java
│   │   │       │   │   ├── ApplicationDTO.java
│   │   │       │   │   ├── ApplicationRepository.java
│   │   │       │   │   ├── ApplicationService.java
│   │   │       │   │   └── ApplicationController.java
│   │   │       │   │
│   │   │       │   ├── eligibility/
│   │   │       │   │   ├── EligibilityService.java
│   │   │       │   │   └── EligibilityController.java
│   │   │       │   │
│   │   │       │   ├── enums/
│   │   │       │   │   ├── OpportunityType.java
│   │   │       │   │   ├── WorkMode.java
│   │   │       │   │   ├── ApplicationStatus.java
│   │   │       │   │   └── FacultyApprovalStatus.java
│   │   │       │   │
│   │   │       │   └── placementstatistics/
│   │   │       │       ├── PlacementStatisticsDTO.java
│   │   │       │       ├── PlacementStatisticsService.java
│   │   │       │       └── PlacementStatisticsController.java
│   │   │       │
│   │   │       └── InternshipPlacementPortalApplication.java  # Main application class
│   │   │
│   │   └── resources/
│   │       └── application.properties.example   # Configuration template
│   │
│   └── test/
│       └── java/
│           └── com/internship/portal/
│               └── InternshipPlacementPortalApplicationTests.java
│
├── pom.xml                        # Maven dependencies and configuration
├── mvnw                           # Maven wrapper (Unix)
├── mvnw.cmd                       # Maven wrapper (Windows)
├── LICENSE                        # MIT License
└── README.md                      # This file
```

## 👥 User Roles

The platform supports four distinct user roles:

1. **STUDENT**
   - Browse and search opportunities
   - Apply for internships/training
   - Manage profile and resume
   - Track application status

2. **FACULTY**
   - Approve/reject student applications
   - View student profiles
   - Monitor department statistics

3. **PLACEMENT_CELL**
   - Create and manage opportunities
   - View all applications
   - Generate placement statistics
   - Manage opportunity deadlines

4. **ADMIN**
   - Full system access
   - User management
   - System configuration

## 🔒 Security

Currently, security is configured to allow all requests for development purposes. For production:

1. Enable JWT authentication
2. Configure role-based access control (RBAC)
3. Enable CSRF protection
4. Implement password encryption (BCrypt)
5. Add rate limiting
6. Configure CORS policies

See `SecurityConfig.java` for current security configuration.

## 🧪 Testing

Run tests using Maven:
```bash
mvn test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Java coding conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Akshay K Baburaj**

## 🙏 Acknowledgments

- Spring Boot community
- PostgreSQL team
- All contributors and users of this platform

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Note**: This is a development version. For production deployment, ensure proper security configurations, environment variables, and database optimizations are in place.

