package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "AUD_COMPLIANCE_REQUIREMENT")
@Setter
@Getter
public class ComplianceRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "requirementName", nullable = false)
    private String requirementName;

    @Column(name = "description")
    private String description;

    @Column(name = "standard", nullable = false)
    private String standard;  // JCI, CBAHI, HIMSS, etc.

    @ManyToOne
    @JoinColumn(name = "createdBy")
    private User createdBy;

    @Column(name = "createdDate")
    private LocalDate createdDate;

    // Additional compliance fields
}
