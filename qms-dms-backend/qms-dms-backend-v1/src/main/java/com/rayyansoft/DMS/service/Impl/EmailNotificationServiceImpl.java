package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.entity.EmailNotification;
import com.rayyansoft.DMS.repository.EmailNotificationRepository;
import com.rayyansoft.DMS.service.EmailNotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailNotificationServiceImpl implements EmailNotificationService {


    private EmailNotificationRepository emailNotificationRepository;


    @Override
    public String findByTriggerEventName(String triggerEventName) {
        return emailNotificationRepository.findByTriggerEventName(triggerEventName)
                .map(EmailNotification::getEmailAddress)
                .orElse(null);
    }
}