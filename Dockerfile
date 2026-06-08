FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY . .
RUN chmod +x ./mvnw
RUN ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 10000
CMD ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar /app/app.jar"]
