package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "AUD_AUDIT_RESPONSE")
@Getter
@Setter
public class AuditResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "audit_id", nullable = false)
    private Audit audit; // The audit to which this response belongs

    @Column(name = "response", columnDefinition = "TEXT", nullable = false)
    private String response; // The response text

    @Column(name = "response_date", nullable = false)
    private LocalDate responseDate; // Date when the response was submitted

    @OneToMany(mappedBy = "auditResponse", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attachment> attachments; // Attachments for this audit response

    @Column(name="responded_by")
    private Long respondedBy;
}
