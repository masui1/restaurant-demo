package com.example.demo.restaurant.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.demo.restaurant.entity.Contact;

@Service
public class ContactMailService {

    private final JavaMailSender mailSender;

    public ContactMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAdminNotification(Contact contact) {
        if (isDevelopment() || mailSender == null) {
            System.out.println("⚠️ メール設定なしまたは開発環境のため、送信をスキップしました。");
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
