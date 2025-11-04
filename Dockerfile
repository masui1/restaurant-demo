# ✅ Java 21 ベース（Spring Boot 3.x 対応）
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Gradle wrapper とビルド
COPY . .
RUN ./gradlew clean build -x test

# 実行ステージ
FROM eclipse-temurin:21-jdk
WORKDIR /app

# jar ファイルをコピー
COPY --from=build /app/build/libs/*.jar app.jar

# ポート設定（Spring Boot のデフォルト）
EXPOSE 8080

# 起動コマンド
ENTRYPOINT ["java", "-jar", "app.jar"]
