package com.example.demo.restaurant.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.demo.restaurant.entity.Contact;

@Service
@ConditionalOnProperty(value = "spring.mail.host", matchIfMissing = false)
public class ContactMailService {

    private final JavaMailSender mailSender;

    public ContactMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAdminNotification(Contact contact) {
        // 開発中はメール送信をスキップ
        if (isDevelopment()) {
            System.out.println("⚠️ 開発環境: メール送信をスキップしました");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("admin@example.com");
            message.setSubject("新しいお問い合わせがあります");
            message.setText(
                "名前: " + contact.getName() + "\n" +
                "メール: " + contact.getEmail() + "\n" +
                "メッセージ:\n" + contact.getMessage()
            );
            mailSender.send(message);
            System.out.println("✅ メール送信成功");
        } catch (Exception e) {
            System.err.println("⚠️ メール送信に失敗しました: " + e.getMessage());
        }
    }

    private boolean isDevelopment() {
        String profile = System.getProperty("spring.profiles.active");
        return profile != null && profile.equals("dev");
    }
}
