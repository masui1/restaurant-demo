package com.example.demo.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.example.demo")
@EnableJpaRepositories(basePackages = {
    "com.example.demo.restaurant.repository",
    "com.example.demo.security"    // ← ここを追加
})
@EntityScan(basePackages = {
    "com.example.demo.restaurant.entity",
    "com.example.demo.security"    // ← User エンティティ用
})
public class RestaurantDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(RestaurantDemoApplication.class, args);
    }
}
