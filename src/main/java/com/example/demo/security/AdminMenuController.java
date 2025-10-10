package com.example.demo.security;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.restaurant.entity.Menu;
import com.example.demo.restaurant.repository.MenuRepository;

@RestController
@RequestMapping("/admin/api/menus") // 管理者専用 API
public class AdminMenuController {

    private final MenuRepository repo;

    public AdminMenuController(MenuRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Menu> getMenus() {
        return repo.findAll();
    }

    @PostMapping
    public Menu addMenu(@RequestPart("menu") Menu menu, @RequestPart(value="image", required=false) MultipartFile image) {
        // 画像は簡略化。保存処理を追加可能
        return repo.save(menu);
    }

    @DeleteMapping("/{id}")
    public void deleteMenu(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
