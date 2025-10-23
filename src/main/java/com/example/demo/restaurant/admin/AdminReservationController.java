package com.example.demo.restaurant.admin;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Reservation;
import com.example.demo.restaurant.repository.ReservationRepository;

@RestController
@RequestMapping("/admin/api/reservation")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReservationController {
	private final ReservationRepository repo;
	
	public AdminReservationController(ReservationRepository repo) {
		this.repo = repo;
	}
	
	@GetMapping
	public List<Reservation> listAll() {
		return repo.findAll();
	}
	
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		repo.deleteById(id);
	}
 }
