package com.example.demo.restaurant.admin;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.restaurant.entity.Contact;
import com.example.demo.restaurant.repository.ContactRepository;

@RestController
@RequestMapping("/admin/api/contact")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactController {

    private final ContactRepository repo;

    public AdminContactController(ContactRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Contact> listAll() {
        return repo.findAll();
    }
}
