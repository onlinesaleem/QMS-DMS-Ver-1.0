package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "AUD_FINDING")
@Setter
@Getter
public class AuditFinding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auditId", nullable = false)
    private Audit audit;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "severityLevel")
    private String severityLevel;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "assignedTo")
    private User assignedTo;

    @Column(name = "dueDate")
    private LocalDate dueDate;

    @Column(name = "resolutionDate")
    private LocalDate resolutionDate;

    // Additional attributes
}
