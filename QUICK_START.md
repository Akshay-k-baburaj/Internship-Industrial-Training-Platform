# 🚀 Quick Start Guide

Get your Internship Industrial Training Platform backend up and running in minutes!

---

## ⚡ Prerequisites Check

Before starting, ensure you have:

- [ ] **Java 23** installed (`java -version`)
- [ ] **PostgreSQL 12+** installed and running
- [ ] **Maven 3.8+** installed (`mvn -version`)
- [ ] **Git** installed
- [ ] **Postman** or similar API testing tool (optional)

---

## 📦 Step 1: Clone & Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd Internship-Industrial-Training-Platform-main

# Verify Java version
java -version
# Should show Java 23

# Verify Maven
mvn -version
```

---

## 🗄️ Step 2: Database Setup

### Option A: Using PostgreSQL CLI

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE internship_portal;

# Exit psql
\q

# Run schema script
psql -U postgres -d internship_portal -f Database/schema.sql
```

### Option B: Using pgAdmin

1. Open pgAdmin
2. Create new database: `internship_portal`
3. Open Query Tool
4. Load and execute `Database/schema.sql`

---

## ⚙️ Step 3: Configure Application

The `application.properties` file is already created. Update these values:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/internship_portal
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE

# Email Configuration (Optional - for email notifications)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.email.enabled=false  # Set to true when email is configured
```

### 📧 Email Setup (Optional)

To enable email notifications:

1. **For Gmail:**
   - Enable 2-Factor Authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use app password in `spring.mail.password`

2. **Update properties:**
   ```properties
   app.email.enabled=true
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-16-char-app-password
   ```

---

## 🏗️ Step 4: Build the Project

```bash
# Clean and build
mvn clean install

# This will:
# - Download all dependencies
# - Compile the code
# - Run tests
# - Create JAR file
```

**Expected output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 45.123 s
```

---

## ▶️ Step 5: Run the Application

### Option A: Using Maven

```bash
mvn spring-boot:run
```

### Option B: Using JAR file

```bash
java -jar target/placement-portal-0.0.1-SNAPSHOT.jar
```

### Option C: Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend
```

---

## ✅ Step 6: Verify Installation

### Check Application Status

1. **Application should start on port 8080**
   ```
   Started InternshipPlacementPortalApplication in 12.345 seconds
   ```

2. **Access Swagger UI:**
   ```
   http://localhost:8080/swagger-ui.html
   ```

3. **Check Health:**
   ```
   http://localhost:8080/actuator/health
   ```
   Should return: `{"status":"UP"}`

---

## 🧪 Step 7: Test the API

### Using cURL

#### 1. Register a User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

**Expected Response:**
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

#### 2. Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

#### 3. Get Current User (with token)
```bash
curl -X GET http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

1. **Import Collection:**
   - Create new collection: "Internship Portal API"
   - Add environment variable: `baseUrl` = `http://localhost:8080`

2. **Test Endpoints:**
   - Register User: `POST {{baseUrl}}/api/v1/auth/register`
   - Login: `POST {{baseUrl}}/api/v1/auth/login`
   - Get Profile: `GET {{baseUrl}}/api/v1/auth/me`

---

## 📁 Project Structure Overview

```
Internship-Industrial-Training-Platform-main/
├── src/
│   ├── main/
│   │   ├── java/com/internship/portal/
│   │   │   ├── config/          # Configurations
│   │   │   ├── security/        # JWT & Security
│   │   │   ├── exception/       # Exception Handling
│   │   │   ├── service/         # Business Logic
│   │   │   ├── user/            # User Module
│   │   │   ├── student/         # Student Module
│   │   │   ├── faculty/         # Faculty Module
│   │   │   ├── opportunity/     # Opportunity Module
│   │   │   └── dto/             # Data Transfer Objects
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Test Files
├── Database/
│   └── schema.sql              # Database Schema
├── uploads/                    # File Uploads (created on first run)
├── logs/                       # Application Logs (created on first run)
├── pom.xml                     # Maven Configuration
├── Dockerfile                  # Docker Configuration
├── docker-compose.yml          # Docker Compose
├── README.md                   # Main Documentation
├── API_DOCUMENTATION.md        # API Reference
└── QUICK_START.md             # This File
```

---

## 🎯 Common Use Cases

### Create a Student Profile

```bash
# 1. Register as student
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "pass123", "role": "STUDENT"}'

# 2. Create student profile (use token from registration)
curl -X POST http://localhost:8080/api/v1/students \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "rollNumber": "CS2024001",
    "fullName": "John Doe",
    "department": "Computer Science",
    "semester": 6,
    "cgpa": 8.5,
    "phone": "9876543210",
    "skills": "Java, Spring Boot, React"
  }'
```

### Post an Opportunity (Placement Cell)

```bash
# 1. Register as placement cell
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "placement@example.com", "password": "pass123", "role": "PLACEMENT_CELL"}'

# 2. Create opportunity
curl -X POST "http://localhost:8080/api/v1/opportunities?postedById=1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Development Intern",
    "description": "Looking for talented interns",
    "companyName": "Tech Corp",
    "type": "INTERNSHIP",
    "requiredSkills": "Java, Spring Boot",
    "requiredCgpa": 7.0,
    "stipend": 15000,
    "duration": "6 months",
    "location": "Bangalore",
    "workMode": "HYBRID",
    "deadline": "2026-03-15",
    "numberOfOpenings": 5
  }'
```

### Apply for Opportunity

```bash
curl -X POST "http://localhost:8080/api/v1/applications/apply?studentId=1&opportunityId=1" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: Application won't start

**Error:** `Failed to configure a DataSource`

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # Mac
# Windows: Check Services app

# Verify database exists
psql -U postgres -l | grep internship_portal

# Check application.properties credentials
```

---

### Issue: Port 8080 already in use

**Solution:**
```bash
# Option 1: Change port in application.properties
server.port=8081

# Option 2: Kill process using port 8080
# Linux/Mac:
lsof -ti:8080 | xargs kill -9

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

### Issue: JWT token errors

**Error:** `Invalid JWT signature`

**Solution:**
```properties
# Ensure jwt.secret is properly set in application.properties
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437

# Clear any cached tokens and re-login
```

---

### Issue: File upload fails

**Error:** `Could not create the directory`

**Solution:**
```bash
# Create upload directories manually
mkdir -p uploads/resumes
mkdir -p uploads/profiles

# Check permissions
chmod 755 uploads
```

---

### Issue: Email not sending

**Solution:**
```properties
# Verify email configuration
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.email.enabled=true

# For testing, disable email
app.email.enabled=false
```

---

## 📊 Default Credentials

After running the application, you can create users with these roles:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| STUDENT | student@test.com | pass123 | Test student account |
| FACULTY | faculty@test.com | pass123 | Test faculty account |
| PLACEMENT_CELL | placement@test.com | pass123 | Test placement cell |
| ADMIN | admin@test.com | pass123 | Test admin account |

**Note:** Create these accounts using the `/api/v1/auth/register` endpoint.

---

## 🎓 Learning Resources

### API Documentation
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs:** http://localhost:8080/api-docs
- **Detailed Guide:** See `API_DOCUMENTATION.md`

### Project Documentation
- **README.md** - Project overview
- **COMPLETE_IMPLEMENTATION_SUMMARY.md** - All features
- **Database/schema.sql** - Database structure

---

## 🚀 Next Steps

1. ✅ **Explore Swagger UI** - Test all endpoints interactively
2. ✅ **Create test data** - Register users, create profiles
3. ✅ **Test workflows** - Complete application flow
4. ✅ **Integrate frontend** - Connect React/Angular frontend
5. ✅ **Deploy** - Move to production environment

---

## 💡 Pro Tips

### Development Mode
```properties
# Enable detailed logging
logging.level.com.internship.portal=DEBUG

# Show SQL queries
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Production Mode
```properties
# Disable detailed logging
logging.level.com.internship.portal=INFO

# Hide SQL queries
spring.jpa.show-sql=false

# Enable email
app.email.enabled=true
```

### Performance Optimization
```properties
# Connection pooling
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# Enable caching
spring.cache.type=simple
```

---

## 📞 Getting Help

- **Issues:** Check `TROUBLESHOOTING.md`
- **API Reference:** See `API_DOCUMENTATION.md`
- **Email:** support@internshipportal.com
- **Documentation:** All `.md` files in project root

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] Java 23 installed
- [ ] PostgreSQL running
- [ ] Database created
- [ ] Schema loaded
- [ ] application.properties configured
- [ ] Application starts successfully
- [ ] Swagger UI accessible
- [ ] Can register a user
- [ ] Can login
- [ ] Can access protected endpoints with token

---

**🎉 Congratulations! Your backend is now running!**

**Time to completion:** ~15 minutes  
**Status:** ✅ Ready for development

---

**Happy Coding! 🚀**
