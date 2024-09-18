package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.DocumentApprovalLevelDto;
import com.rayyansoft.DMS.dto.DocumentApprovalUserDto;
import com.rayyansoft.DMS.dto.DocumentApprovalWorkFlowDto;
import com.rayyansoft.DMS.entity.ApprovalLevel;
import com.rayyansoft.DMS.entity.DocumentApprovalUser;
import com.rayyansoft.DMS.service.DocumentApprovalWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/docs-workflow")

public class DocumentApprovalController {

    @Autowired
    private DocumentApprovalWorkflowService documentApprovalWorkflowService;

    @GetMapping
    public List<DocumentApprovalUserDto> getAllApprovalUser()

    {
        List<DocumentApprovalUserDto> documentApprovalUserDtos=documentApprovalWorkflowService.getAllDocumentApprovalUser();
        return documentApprovalUserDtos;

    }

    @GetMapping("reviewer/users/{id}")
    public List<DocumentApprovalUser> getApprovalUserByDepartment(@PathVariable("id") Long departmentId )
    {
        return documentApprovalWorkflowService.findByUserDepartmentId(departmentId);
    }

    @GetMapping("approvals/executive/{approverType}")
    public List<DocumentApprovalUser> getApprovalUserByDepartment(@PathVariable("approverType") DocumentApprovalUser.ApproverType aproverType )
    {
        return documentApprovalWorkflowService.findByExecutiveUserApproval(String.valueOf(aproverType));
    }

    @GetMapping("approvals/pending/{userId}")
    public List<DocumentApprovalLevelDto> getPendingApprovalsForUser(@PathVariable Long userId) {
        return documentApprovalWorkflowService.findByApproverIdAndStatus(userId, ApprovalLevel.ApprovalStatus.PENDING);
    }

    @GetMapping("/approvals/workflow/{documentId}")
    public List<DocumentApprovalWorkFlowDto> getApprovalWorkflowForDocument(@PathVariable Long documentId) {

    return  documentApprovalWorkflowService.findByDocumentId(documentId);

    }

    @PutMapping("/approvals/{approvalLevelId}")
    public ResponseEntity<?> updateApprovalStatus(@PathVariable Long approvalLevelId, @RequestBody DocumentApprovalLevelDto documentApprovalLevelDto) {
        documentApprovalWorkflowService.updateApprovalStatus(approvalLevelId,documentApprovalLevelDto);
        System.out.println("the function clicked");
        return ResponseEntity.ok("Record saved");
    }


}
