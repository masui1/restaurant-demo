package com.example.demo.security;

import java.util.List;

import org.springframework.http.ResponseEntity;
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
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/admin/api/menus")
public class AdminMenuController {

    private final MenuRepository repo;
    private final FileStorageService storage;
    private final ObjectMapper objectMapper;

    public AdminMenuController(MenuRepository repo, FileStorageService storage, ObjectMapper objectMapper) {
        this.repo = repo;
        this.storage = storage;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public List<Menu> getMenus() {
        return repo.findAll();
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Menu> addMenu(@RequestPart("menu") String menuJson,
                                        @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Menu dto = objectMapper.readValue(menuJson, Menu.class);
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = storage.store(image);
            }
            Menu m = new Menu(dto.getName(), dto.getPrice(), dto.getDescription(), imageUrl, dto.getAllergy());
            m.setRecommended(dto.isRecommended());
            return ResponseEntity.ok(repo.save(m));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id,
                                           @RequestPart("menu") String menuJson,
                                           @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Menu existing = repo.findById(id).orElse(null);
            if (existing == null) return ResponseEntity.notFound().build();

            Menu dto = objectMapper.readValue(menuJson, Menu.class);

            // 画像更新
            if (image != null && !image.isEmpty()) {
                String imageUrl = storage.store(image);
                existing.setImageUrl(imageUrl);
            }

            // 他の項目を上書き
            existing.setName(dto.getName());
            existing.setPrice(dto.getPrice());
            existing.setDescription(dto.getDescription());
            existing.setAllergy(dto.getAllergy());
            existing.setRecommended(dto.isRecommended());

            return ResponseEntity.ok(repo.save(existing));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
