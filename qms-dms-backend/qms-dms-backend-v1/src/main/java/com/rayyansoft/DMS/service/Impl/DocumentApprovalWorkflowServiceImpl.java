package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.DocumentApprovalLevelDto;
import com.rayyansoft.DMS.dto.DocumentApprovalUserDto;
import com.rayyansoft.DMS.dto.DocumentApprovalWorkFlowDto;
import com.rayyansoft.DMS.dto.DocumentDto;
import com.rayyansoft.DMS.entity.ApprovalLevel;
import com.rayyansoft.DMS.entity.ApprovalWorkflow;
import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.entity.DocumentApprovalUser;
import com.rayyansoft.DMS.repository.ApprovalLevelRepository;
import com.rayyansoft.DMS.repository.DocumentApprovalUserRepository;
import com.rayyansoft.DMS.repository.DocumentApprovalWorkflowRepository;
import com.rayyansoft.DMS.repository.DocumentRepository;
import com.rayyansoft.DMS.service.DocumentApprovalWorkflowService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DocumentApprovalWorkflowServiceImpl implements DocumentApprovalWorkflowService {

    private DocumentApprovalUserRepository documentApprovalUserRepository;

    private ApprovalLevelRepository approvalLevelRepository;

    private DocumentApprovalWorkflowRepository documentApprovalWorkflowRepository;

    private DocumentRepository documentRepository;

    private ModelMapper modelMapper;

    @Override
    public List<DocumentApprovalUserDto> getAllDocumentApprovalUser() {
        List<DocumentApprovalUser> documentApprovalUsers=documentApprovalUserRepository.findAll();
        return documentApprovalUsers.stream().map(documentApprovalUser -> modelMapper.map(documentApprovalUser,DocumentApprovalUserDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentApprovalUser> findByUserDepartmentId(Long departmentId) {
        List<DocumentApprovalUser> documentApprovalUsers=documentApprovalUserRepository.findByUserDepartmentId(departmentId);
        return documentApprovalUsers.stream().toList();
    }

    @Override
    public List<DocumentApprovalUser> findByExecutiveUserApproval(String approverType) {
        List<DocumentApprovalUser> documentApprovalUsers=documentApprovalUserRepository.findByExecutiveUserApproval(DocumentApprovalUser.ApproverType.valueOf(approverType));
        return documentApprovalUsers.stream().toList();
    }

    public DocumentApprovalLevelDto convertToDto(ApprovalLevel approvalLevel) {
        DocumentApprovalLevelDto dto = new DocumentApprovalLevelDto();
        dto.setId(approvalLevel.getId());
        dto.setLevel(approvalLevel.getLevel());
        dto.setStatus(approvalLevel.getStatus());
        dto.setComments(approvalLevel.getComments());
        dto.setTimestamp(approvalLevel.getTimestamp());

        // Map the Document entity to DocumentDto
        DocumentDto documentDto = new DocumentDto();
        documentDto.setId(approvalLevel.getDocument().getId());
        documentDto.setTitle(approvalLevel.getDocument().getTitle());  // Only map the required fields
        dto.setDocument(documentDto);

        return dto;
    }
    @Override
    public List<DocumentApprovalLevelDto> findByApproverIdAndStatus(Long approverId, ApprovalLevel.ApprovalStatus status) {

        List<ApprovalLevel> approvalLevels=approvalLevelRepository.findByApproverIdAndStatus(approverId,status);
        DocumentApprovalLevelDto documentApprovalLevelDto=new DocumentApprovalLevelDto();
        return approvalLevels.stream()
                .map(this::convertToDto)  // Use the conversion method
                .collect(Collectors.toList());
       // return approvalLevels.stream().map(approvalLevel -> modelMapper.map(approvalLevel,DocumentApprovalLevelDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<DocumentApprovalWorkFlowDto> findByDocumentId(Long documentId) {

        List<ApprovalWorkflow> approvalWorkflows=documentApprovalWorkflowRepository.findByDocumentId(documentId);

        return approvalWorkflows.stream().map(approvalWorkflow -> modelMapper.map(approvalWorkflow,DocumentApprovalWorkFlowDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void updateApprovalStatus(Long approvalLevelId, DocumentApprovalLevelDto documentApprovalLevelDto) {
        ApprovalLevel approvalLevel = approvalLevelRepository.findById(approvalLevelId)
                .orElseThrow(() -> new RuntimeException("Approval level not found"));

        approvalLevel.setStatus(documentApprovalLevelDto.getStatus());
        approvalLevel.setComments(documentApprovalLevelDto.getComments());
        approvalLevel.setTimestamp(LocalDateTime.now());

        approvalLevelRepository.save(approvalLevel);

        // Record the action in ApprovalWorkflow
        ApprovalWorkflow workflow = new ApprovalWorkflow();
        workflow.setDocument(approvalLevel.getDocument());
        workflow.setUser(approvalLevel.getApprover());
        workflow.setAction(documentApprovalLevelDto.getStatus().name());
        workflow.setTimestamp(LocalDateTime.now());
        workflow.setLevel(approvalLevel.getLevel());
        workflow.setComments(documentApprovalLevelDto.getComments());

        documentApprovalWorkflowRepository.save(workflow);
        // Check if all approvals are complete and update document status
        updateDocumentStatusIfAllApproved(approvalLevel.getDocument().getId());

    }

    @Override
    public void updateDocumentStatusIfAllApproved(Long documentId) {

        // Fetch all approval levels for the given document
        List<ApprovalLevel> approvalLevels = approvalLevelRepository.findByDocument_Id(documentId);

        // Check if all approval levels are either approved or rejected
        boolean allApproved = approvalLevels.stream()
                .allMatch(level -> level.getStatus() == ApprovalLevel.ApprovalStatus.APPROVED);

        boolean anyRejected = approvalLevels.stream()
                .anyMatch(level -> level.getStatus() == ApprovalLevel.ApprovalStatus.REJECTED);

        // Fetch the document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Update the document status based on approvals
        if (allApproved) {
            document.setApprovalStatus(Document.ApprovalStatus.APPROVED);  // Final level approved
        } else if (anyRejected) {
            document.setApprovalStatus(Document.ApprovalStatus.REJECTED);  // If any level rejected
        }

        documentRepository.save(document);
    }

    }

