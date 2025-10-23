package com.example.demo.restaurant.service;

import java.util.List;
import java.util.Random;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.restaurant.entity.Menu;
import com.example.demo.restaurant.repository.MenuRepository;

@Service
public class RecommendedMenuScheduler {

    private final MenuRepository menuRepository;
    private final Random random = new Random();

    public RecommendedMenuScheduler(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // 毎9時に実行（cron式）
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void updateRecommendedMenu() {
        List<Menu> allMenus = menuRepository.findAll();
        if (allMenus.isEmpty()) return;

        // 全ておすすめフラグを false に
        allMenus.forEach(menu -> menu.setRecommended(false));

        // ランダムに1つ選んでおすすめに設定
        int index = random.nextInt(allMenus.size());
        allMenus.get(index).setRecommended(true);

        menuRepository.saveAll(allMenus);

        System.out.println("おすすめメニューを更新しました: " + allMenus.get(index).getName());
    }
}
