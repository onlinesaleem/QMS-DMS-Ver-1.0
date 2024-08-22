package com.rayyansoft.DMS.service;


import org.springframework.scheduling.annotation.Async;

import java.util.concurrent.CompletableFuture;


public interface EmailService {

    CompletableFuture<Void> sendSimpleEmailAsync(String[] to, String subject, String text);

    @Async
    CompletableFuture<Void> sendHtmlEmailAsync(String[] to, String subject, String htmlContent);
}
