package com.example.demo.restaurant.entity;

import jakarta.persistence.Column;
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
	@Column(length=1000)
	private String description;
	private String imageUrl;
	@Column(length = 255)
	private String allergy;
	@Column(nullable = false)
	private Boolean recommended = false;
	
	public Menu() {}
	public Menu(String name, int price, String description, String imageUrl, String allergy) {
		this.name = name;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this.allergy = allergy;
	}

	// getter/setter
	public Long getId() { return id; }
    public String getName() { return name; }
    public int getPrice() { return price; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public void setName(String name) { this.name = name; }
    public void setPrice(int price) { this.price = price; }
    public void setDescription(String description) { this.description = description; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAllergy() { return allergy; }
    public void setAllergy(String allergy) { this.allergy = allergy; }
    public Boolean isRecommended() { return recommended ; }
    public void setRecommended(boolean recommended) { this.recommended = recommended;}
}
