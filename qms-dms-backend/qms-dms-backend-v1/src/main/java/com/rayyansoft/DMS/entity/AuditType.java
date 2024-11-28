package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="AUDIT_AUDIT_TYPE")
@Getter
@Setter
public class AuditType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="auditName")
    private String auditName;

    @Column(name="active")
    private Boolean active;

    @Column(name="auditTypeDesc",columnDefinition = "TEXT")

    private String auditTypeDesc;



}
