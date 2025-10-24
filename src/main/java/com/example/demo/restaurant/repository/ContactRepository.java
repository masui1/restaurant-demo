package com.example.demo.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.restaurant.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
