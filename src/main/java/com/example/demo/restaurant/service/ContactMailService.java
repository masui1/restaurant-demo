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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("admin@example.com"); // 管理者メール
        message.setSubject("新しいお問い合わせがあります");
        message.setText(
            "名前: " + contact.getName() + "\n" +
            "メール: " + contact.getEmail() + "\n" +
            "メッセージ:\n" + contact.getMessage()
        );
        mailSender.send(message);
    }
}
