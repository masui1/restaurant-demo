package com.example.demo.restaurant.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Menu {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	private int price;
	private String description;
	
	public Menu() {}
	public Menu(String name, int price, String description) {
		this.name = name;
		this.price = price;
		this.description = description;
	}

	// getter/setter
	public Long getId() { return id; }
    public String getName() { return name; }
    public int getPrice() { return price; }
    public String getDescription() { return description; }
    public void setName(String name) { this.name = name; }
    public void setPrice(int price) { this.price = price; }
    public void setDescription(String description) { this.description = description; }
}
