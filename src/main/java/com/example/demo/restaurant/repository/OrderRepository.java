package com.example.demo.restaurant.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.restaurant.entity.Order;


public interface OrderRepository extends JpaRepository<Order, Long> {
	Page<Order> findAllByOrderByIdDesc(Pageable pageable);
}
