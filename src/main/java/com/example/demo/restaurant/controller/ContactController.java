package com.example.demo.restaurant.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Contact;
import com.example.demo.restaurant.repository.ContactRepository;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
	
	private final ContactRepository repo;
	
	public ContactController(ContactRepository repo) {
		this.repo = repo;
	}
	
	@PostMapping
	public ResponseEntity<Contact> create(@RequestBody  Contact contact) {
		Contact saved = repo.save(contact);
		
		return ResponseEntity.ok(repo.save(contact));
	}

}
