package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.ApprovalLevel;
import com.rayyansoft.DMS.entity.DocumentApprovalUser;

import java.util.List;

public interface DocumentApprovalWorkflowService {

    List<DocumentApprovalUserDto> getAllDocumentApprovalUser();

    List<DocumentApprovalUser> findByUserDepartmentId(Long departmentId);

    List<DocumentApprovalUser> findByExecutiveUserApproval(String approverType);

    List<DocumentApprovalLevelDto> findByApproverIdAndStatus(Long approverId, ApprovalLevel.ApprovalStatus status);

    List<DocumentApprovalWorkFlowDto> findByDocumentId(Long documentId);

    void updateApprovalStatus(Long approvalLevelId,DocumentApprovalLevelDto documentApprovalLevelDto);

   void resetRejectedApprovalLevel(Long documentId,String comments);

   List<DocumentApprovalUserSummaryDto> findAllApprovalUser();


    public DocumentApprovalUserDto createApprovalUser(DocumentApprovalUserDto documentApprovalUserDto);

}
