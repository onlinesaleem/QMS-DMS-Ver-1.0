package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailNotificationRepository extends JpaRepository<EmailNotification,Long> {



    Optional<EmailNotification> findByTriggerEventName(String triggerEventName);




}
