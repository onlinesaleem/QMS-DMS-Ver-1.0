package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "dms.document_version")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "revisionNumber", nullable = false)
    private int revisionNumber;

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "updatedBy")
    private User updatedBy;

    @Column(name = "updatedDate", nullable = false)
    private LocalDate updatedDate;

    @Column(name = "changeSummary")
    private String changeSummary;

    @Enumerated(EnumType.STRING)
    @Column(name = "approvalStatus", nullable = false)
    private Document.ApprovalStatus approvalStatus;

    @Column(name = "attachments")
    private String attachments; // Optional, can store attachment references
}
