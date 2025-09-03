# Use official Maven image to build (if you’re using Maven)
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set working dir
WORKDIR /app

# Copy pom.xml and download dependencies first (caching layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests

# --------- Runtime image ------------
FROM eclipse-temurin:21-jdk

# Set working dir
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose app port (usually 8080)
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
