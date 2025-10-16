package com.example.demo.restaurant.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.restaurant.entity.Menu;
import com.example.demo.restaurant.repository.MenuRepository;
import com.example.demo.restaurant.storage.FileStorageService;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin
public class MenuController {
    private final MenuRepository repo;
    private final FileStorageService storage;
    
    public MenuController(MenuRepository repo, FileStorageService storage) {
        this.repo = repo;
        this.storage = storage;
    }

    @GetMapping
    public List<Menu> getMenus() {
        return repo.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Menu> getOne(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 既存メニューに画像をアップロード
    @PostMapping("/{id}/upload")
    public ResponseEntity<Menu> uploadImage(@PathVariable Long id,
                                            @RequestPart("image") MultipartFile image) {
        Optional<Menu> opt = repo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Menu menu = opt.get();

        if (image != null && !image.isEmpty()) {
            String imageUrl = storage.store(image);
            menu.setImageUrl(imageUrl);
            repo.save(menu);
        }

        return ResponseEntity.ok(menu);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Menu create(@RequestPart("menu") Menu dto,
                       @RequestPart(value = "image", required = false) MultipartFile image) {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = storage.store(image);
        }
        Menu m = new Menu(dto.getName(), dto.getPrice(), dto.getDescription(), imageUrl, dto.getAllergy());
        return repo.save(m);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Menu> update(@PathVariable Long id,
                                       @RequestPart("menu") Menu dto,
                                       @RequestPart(value = "image", required = false) MultipartFile image) {
        Optional<Menu> opt = repo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Menu m = opt.get();
        m.setName(dto.getName());
        m.setPrice(dto.getPrice());
        m.setDescription(dto.getDescription());
        if (image != null && !image.isEmpty()) {
            String url = storage.store(image);
            m.setImageUrl(url);
        }
        return ResponseEntity.ok(repo.save(m));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
