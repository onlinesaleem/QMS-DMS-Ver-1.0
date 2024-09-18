package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.ApprovalLevel;
import com.rayyansoft.DMS.entity.ApprovalWorkflow;
import com.rayyansoft.DMS.entity.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DocumentDetailsDto {

    private Long id;
    private String title;
    private String status;
    private String createdBy;
    private LocalDate createdDate;
    private String department;
    private String documentType;
    private List<DocumentApprovalLevelDto> approvalLevels;
    private List<DocumentApprovalWorkFlowDto> workflowHistory;



}
