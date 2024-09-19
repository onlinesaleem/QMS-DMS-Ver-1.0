package com.rayyansoft.DMS.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name="dms.document")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="title")
    private String title;

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;



    @ManyToOne
    private User createdBy;

    @Column(name="createdDate")
    private LocalDate createdDate;

    @Column(name="updateDate")
    private LocalDate updatedDate;

    @Column(name="issueDate")
    private String issueDate;

    @Column(name="reviewDate")
    private String reviewDate;

    @Column(name="effectiveDate")
    private String effectiveDate;

    @Enumerated(EnumType.STRING)
    @Column(name="approvalStatus", nullable = false)
    private ApprovalStatus approvalStatus;



    @ManyToOne
    @JoinColumn(name = "updatedBy")
    private User updatedBy;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApprovalLevel> approvalLevels;  // New relationship to ApprovalLevel


    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments;
    public enum ApprovalStatus {
        UNDER_REVIEW,
        REVIEWED,
       APPROVED,
        REJECTED,
        DRAFT,
        REVISION_REQUIRED
    }

    @ManyToOne
    @JoinColumn(name="departmentId", nullable=false)
    private Department documentDepartment;

    @ManyToOne
    @JoinColumn(name="documentTypeId",nullable = false)
    private DocumentType documentType;

    @Column(name = "revisionNumber", nullable = false)
    private int revisionNumber = 1;

    @Column(name = "rejectionReason")
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "resubmissionStatus", nullable = false)
    private ResubmissionStatus resubmissionStatus = ResubmissionStatus.NONE;

    @Column(name = "approvalCycleCount", nullable = false)
    private int approvalCycleCount = 0;
    public enum ResubmissionStatus {
        NONE,
        RESUBMITTED,
        UNDER_REVISION
    }

}
