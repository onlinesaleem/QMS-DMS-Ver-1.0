package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "dms.approval_level")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalLevel {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne
    @JoinColumn(name = "approver_id", nullable = false)
    private User approver;  // User assigned to this approval level

    @Column(name = "level")
    private int level;  // Represents the approval level (e.g., 1, 2, 3)

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApprovalStatus status;  // PENDING, APPROVED, REJECTED

    @Column(name = "comments", nullable = true)
    private String comments;  // Approval or rejection comments

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;  // Time when the action was taken


    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
