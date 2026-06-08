FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY . .
RUN chmod +x ./mvnw
RUN ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar
COPY --from=build /app/index.html /app/index.html
COPY --from=build /app/assets /app/assets
COPY --from=build /app/concept /app/concept
COPY --from=build /app/contact /app/contact
COPY --from=build /app/guide /app/guide
COPY --from=build /app/menu /app/menu
COPY --from=build /app/news /app/news
COPY --from=build /app/privacy /app/privacy
COPY --from=build /app/reserve /app/reserve
COPY --from=build /app/store /app/store
COPY --from=build /app/terms /app/terms
COPY --from=build /app/zounian-top /app/zounian-top

EXPOSE 10000
CMD ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar /app/app.jar"]
