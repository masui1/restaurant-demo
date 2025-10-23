package com.example.demo.restaurant.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Reservation;
import com.example.demo.restaurant.repository.ReservationRepository;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
	
	private final ReservationRepository repo;
	
	public ReservationController(ReservationRepository repo) {
		this.repo = repo;
	}
	
	// 登録
	@PostMapping
	public ResponseEntity<Reservation> create(@RequestBody Reservation reservation) {
		return ResponseEntity.ok(repo.save(reservation));
	}
	
	// 一覧
	public List<Reservation> list() {
		return repo.findAll();
	}
}
