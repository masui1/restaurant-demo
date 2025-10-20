package com.example.demo.restaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.restaurant.entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByRecommendedTrue();
}
