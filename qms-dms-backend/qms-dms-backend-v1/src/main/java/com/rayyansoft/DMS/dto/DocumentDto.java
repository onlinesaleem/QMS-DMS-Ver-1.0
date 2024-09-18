package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.ApprovalLevel;
import com.rayyansoft.DMS.entity.Department;
import com.rayyansoft.DMS.entity.DocumentType;
import com.rayyansoft.DMS.entity.User;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDto {
    private Long id;
    private String title;
    private String content;
    private Long departmentId;
    private String approvalStatus;
    private String createdDate;

    private Long documentTypeId;

    private String issueDate;


    private String reviewDate;


    private String effectiveDate;

    //    private User createdBy;
    private List<AttachmentDto> attachments;
    private Department documentDepartment;

    private DocumentType documentType;

    private List<ListApprovalDto> approvalLevels;  // New relationship to ApprovalLevel
}
