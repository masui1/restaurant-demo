package com.example.demo.restaurant.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Order;
import com.example.demo.restaurant.repository.OrderRepository;

@RestController
@RequestMapping("/admin/api/orders")
@PreAuthorize("hasRole('ADMIN')") // 管理者専用
public class AdminOrderController {

    private final OrderRepository orderRepository;

    public AdminOrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ページング付き注文一覧
    @GetMapping
    public Page<Order> listOrders(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size) {
        return orderRepository.findAllByOrderByIdDesc(PageRequest.of(page, size));
    }

    // 注文詳細
    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("注文が存在しません"));
    }
}
