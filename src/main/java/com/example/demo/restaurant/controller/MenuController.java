package com.example.demo.restaurant.controller;

import java.io.IOException;
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
import com.example.demo.restaurant.service.SupabaseStorageService;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin
public class MenuController {

    private final MenuRepository repo;
    private final SupabaseStorageService storage;

    public MenuController(MenuRepository repo, SupabaseStorageService storage) {
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

    @GetMapping("/recommended")
    public List<Menu> getRecommendedMenus() {
        return repo.findByRecommendedTrue();
    }

    // 既存メニューに画像をアップロードしてSupabaseに保存
    @PostMapping("/{id}/upload")
    public ResponseEntity<Menu> uploadImage(@PathVariable Long id,
                                            @RequestPart("image") MultipartFile image) {
        Optional<Menu> opt = repo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Menu menu = opt.get();

        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = storage.uploadFile(image); // Supabaseにアップロード
                menu.setImageUrl(imageUrl);
                repo.save(menu);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        }

        return ResponseEntity.ok(menu);
    }

    // 新規メニュー作成
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Menu> create(@RequestPart("menu") Menu dto,
                                       @RequestPart(value = "image", required = false) MultipartFile image) {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            try {
                imageUrl = storage.uploadFile(image); // Supabaseにアップロード
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        }

        Menu menu = new Menu(dto.getName(), dto.getPrice(), dto.getDescription(), imageUrl, dto.getAllergy());
        menu.setRecommended(dto.isRecommended());
        return ResponseEntity.ok(repo.save(menu));
    }

    // メニュー更新
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Menu> update(@PathVariable Long id,
                                       @RequestPart("menu") Menu dto,
                                       @RequestPart(value = "image", required = false) MultipartFile image) {
        Optional<Menu> opt = repo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Menu menu = opt.get();
        menu.setName(dto.getName());
        menu.setPrice(dto.getPrice());
        menu.setDescription(dto.getDescription());
        menu.setAllergy(dto.getAllergy());
        menu.setRecommended(dto.isRecommended());

        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = storage.uploadFile(image); // Supabaseにアップロード
                menu.setImageUrl(imageUrl);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        }

        return ResponseEntity.ok(repo.save(menu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
