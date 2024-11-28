package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "AUD_SCHEDULE")
@Setter
@Getter
public class AuditSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auditId", nullable = false)
    private Audit audit;

    @Column(name = "scheduleDate", nullable = false)
    private LocalDate scheduleDate;

    @Column(name = "location")
    private String location;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "auditorId")
    private User auditor;

    // Additional fields if required
}
