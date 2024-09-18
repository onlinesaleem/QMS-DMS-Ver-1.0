package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.ApprovalLevel;
import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentApprovalLevelDto {

    private Long id;
    private int level;  // Represents the approval level (e.g., 1, 2, 3)
    private ApprovalLevel.ApprovalStatus status;  // PENDING, APPROVED, REJECTED
    private String comments;  // Approval or rejection comments
    private LocalDateTime timestamp;  // Time when the action was taken
    private Long documentId;
    private UserDetailsDto approver;
    private DocumentDto document;



}
