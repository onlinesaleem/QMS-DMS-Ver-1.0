# Use OpenJDK 22 as base image
FROM openjdk:22-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the host machine to the container
COPY target/nbcc-ovr.jar /app/nbcc-ovr.jar

# Expose the port that your Spring Boot application listens on
EXPOSE 8080

# Command to run the Spring Boot application
CMD ["java", "-jar", "nbcc-ovr.jar"]
