FROM openjdk:23-jdk-slim

LABEL maintainer="internship-portal@example.com"
LABEL description="Internship Industrial Training Platform Backend"

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Create uploads directory
RUN mkdir -p /app/uploads/resumes /app/uploads/profiles

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "target/placement-portal-0.0.1-SNAPSHOT.jar"]
