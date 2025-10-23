package com.example.demo.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.restaurant.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
