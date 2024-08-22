package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="emailNotification")
@Data
public class EmailNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="emailAddress")
    private String emailAddress;

    @Column(name="triggerEventName")
    private String triggerEventName;

    @Column(name="active")
    private Boolean active;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "EmailNotification{" +
                "id=" + id +
                ", emailAddress='" + emailAddress + '\'' +
                ", triggerEventName='" + triggerEventName + '\'' +
                ", active=" + active +
                '}';
    }
}
