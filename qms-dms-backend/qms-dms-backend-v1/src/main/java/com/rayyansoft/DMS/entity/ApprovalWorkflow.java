package com.rayyansoft.DMS.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "dms.approval_workflow")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // The user who performed the action (reviewed/approved/rejected)


    @Column(name = "action", nullable = false)
    private String action;  // REVIEWED, APPROVED, REJECTED

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;  // When the action occurred

    @Column(name = "comments", nullable = true)
    private String comments;  // Optional rejection reason or review notes

    @Column(name = "level")
    private int level; // Represents the approval level (e.g., 1, 2, 3)



}
