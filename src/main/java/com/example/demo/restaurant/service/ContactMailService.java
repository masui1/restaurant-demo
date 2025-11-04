package com.example.demo.restaurant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.demo.restaurant.entity.Contact;

@Service
public class ContactMailService {

    @Autowired(required = false)
    private JavaMailSender mailSender; // ← Beanがなくても起動できるように変更

    public void sendAdminNotification(Contact contact) {
        // JavaMailSender がない場合はスキップ
        if (mailSender == null) {
            System.out.println("⚠️ JavaMailSender が未設定のため、メール送信をスキップしました");
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
}
