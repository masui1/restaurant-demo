// src/main/java/com/example/demo/restaurant/controller/OrderController.java
package com.example.demo.restaurant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Order;
import com.example.demo.restaurant.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepo.save(order);
    }

    @GetMapping
    public java.util.List<Order> getAllOrders() {
        return orderRepo.findAll();
    }
}
