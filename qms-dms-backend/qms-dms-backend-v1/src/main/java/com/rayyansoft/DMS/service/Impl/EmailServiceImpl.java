package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.util.concurrent.CompletableFuture;


@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    public void sendSimpleEmail(String[] to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("notification@bloodandcancer.org");
        mailSender.send(message);
    }

    @Override
    @Async
    public CompletableFuture<Void> sendSimpleEmailAsync(String[] to, String subject, String text) {
        try {
            sendSimpleEmail(to, subject, text);
        } catch (Exception e) {
            logger.error("Failed to send email", e);
        }
        return CompletableFuture.completedFuture(null);
    }

    @Override
    @Async
    public CompletableFuture<Void> sendHtmlEmailAsync(String[] to, String subject, String htmlContent) {
        try {
            sendHtmlEmail(to, subject, htmlContent);
        } catch (MessagingException e) {
            logger.error("Failed to send HTML email", e);
        }
        return CompletableFuture.completedFuture(null);
    }

    public void sendHtmlEmail(String[] to, String subject, String htmlContent) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        helper.setTo(to);

        helper.setSubject(subject);
        helper.setText(htmlContent, true); // Set to true to indicate HTML content
        helper.setFrom("notification@bloodandcancer.org");
        mailSender.send(mimeMessage);
    }



}
