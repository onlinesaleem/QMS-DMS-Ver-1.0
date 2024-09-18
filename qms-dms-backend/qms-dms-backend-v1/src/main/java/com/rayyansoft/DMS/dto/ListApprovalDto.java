package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.ApprovalLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ListApprovalDto {

    private Long id;
    private int level;  // Represents the approval level (e.g., 1, 2, 3)
    private ApprovalLevel.ApprovalStatus status;  // PENDING, APPROVED, REJECTED
    private String comments;  // Approval or rejection comments
    private LocalDateTime timestamp;  // Time when the action was taken
    private Long documentId;
}
