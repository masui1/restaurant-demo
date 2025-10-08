package com.example.demo.restaurant.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Menu; // ← ★ これが必要！
import com.example.demo.restaurant.repository.MenuRepository;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin
public class MenuController {
    private final MenuRepository repo;
    
    public MenuController(MenuRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Menu> getMenus() {
        return repo.findAll();
    }

    @PostMapping
    public Menu addMenu(@RequestParam String name, @RequestParam int price, @RequestParam String description) {
        return repo.save(new Menu(name, price, description));
    }
}
