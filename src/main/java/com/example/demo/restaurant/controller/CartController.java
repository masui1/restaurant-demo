package com.example.demo.restaurant.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Menu;
import com.example.demo.restaurant.repository.MenuRepository;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {
	
	private final List<Menu> cart = new ArrayList<>();
	
	@PostMapping("/add/{menuId}")
	public ResponseEntity<List<Menu>> addToCart(@PathVariable Long menuId, MenuRepository repo) {
		Optional<Menu> opt = repo.findById(menuId);
		if (opt.isEmpty()) return ResponseEntity.notFound().build();
		cart.add(opt.get());
		return ResponseEntity.ok(cart);
	}
	
	@GetMapping
	public List<Menu> getCart() {
		return cart;
	}
	
	@DeleteMapping("/{menuId}")
	public ResponseEntity<List<Menu>> removeFromCart(@PathVariable Long menuId) {
		cart.removeIf(m -> m.getId().equals(menuId));
		
		return ResponseEntity.ok(cart);
	}
}
