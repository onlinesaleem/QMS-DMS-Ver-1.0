package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController

@AllArgsConstructor
@RequestMapping("/api/email")
public class EmailController {

    private EmailService emailService;


    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @PostMapping("/send")
    public String sendEmail(@RequestParam String[] to, @RequestParam String subject, @RequestParam String text) {
        emailService.sendSimpleEmailAsync(to, subject, text);
        return "Email sent successfully";
    }
}
