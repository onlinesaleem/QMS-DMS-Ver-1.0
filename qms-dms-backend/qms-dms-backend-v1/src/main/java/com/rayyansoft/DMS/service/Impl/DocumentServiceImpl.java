package com.rayyansoft.DMS.service.Impl;


import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.*;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.repository.*;
import com.rayyansoft.DMS.service.DocumentService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private DocumentRepository documentRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;
    private AttachmentRepository attachmentRepository;
    private DepartmentRepository departmentRepository;
    private DocumentTypeRepository documentTypeRepository;
    private DocumentApprovalWorkflowRepository documentApprovalWorkflowRepository;
    private DocumentApprovalUserRepository documentApprovalUserRepository;
    private ApprovalLevelRepository approvalLevelRepository;

    @Override
    public DocumentDto createDocument(DocumentDto documentDTO, AttachmentDto attachmentDTO, MultipartFile file) throws IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Department department = departmentRepository.findById(documentDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        DocumentType documentType=documentTypeRepository.findById(documentDTO.getDocumentTypeId())
                .orElseThrow(()-> new RuntimeException("document type not found"));

        Document document = modelMapper.map(documentDTO, Document.class);
        document.setCreatedDate(LocalDate.now());
        document.setApprovalStatus(Document.ApprovalStatus.UNDER_REVIEW);
       document.setCreatedBy(user.get());
       document.setDocumentDepartment(department);
       document.setDocumentType(documentType);

       ApprovalWorkflow approvalWorkflow=new ApprovalWorkflow();

       approvalWorkflow.setAction("UNDER_REVIEW");
       approvalWorkflow.setDocument(document);
       approvalWorkflow.setTimestamp(LocalDateTime.now());
       approvalWorkflow.setUser(user.get());

        // Handle file attachment (if provided)
        // Handle file attachment (if provided)

        if (file != null && !file.isEmpty()) {
            Attachment attachmentEntity = handleFileUpload(file, document);
            document.setAttachments(Collections.singletonList(attachmentEntity)); // Set the file(s) for the document
        }




        Document savedDocument = documentRepository.save(document);

        // Create Approval Levels (you will implement the logic to determine approvers)
        List<DocumentApprovalUserDto> approvers = getApproversForDocument(savedDocument); // Custom logic to find approvers
        createApprovalLevelsForDocument(savedDocument, approvers); // Creating approval levels


        documentApprovalWorkflowRepository.save(approvalWorkflow);
        return modelMapper.map(savedDocument, DocumentDto.class);
    }


    private void createApprovalLevelsForDocument(Document savedDocument, List<DocumentApprovalUserDto> approvers) {
        int level = 1;
        for (DocumentApprovalUserDto approverDto : approvers) {
            // Create and set approval level details
            ApprovalLevel approvalLevel = new ApprovalLevel();
            approvalLevel.setDocument(savedDocument);
            approvalLevel.setApprover(approverDto.getUser()); // Map the DTO to the entity
            approvalLevel.setLevel(level);
            approvalLevel.setStatus(ApprovalLevel.ApprovalStatus.PENDING);
            approvalLevel.setTimestamp(LocalDateTime.now());

            // Save each approval level
            approvalLevelRepository.save(approvalLevel);
            level++;
        }
    }

    // Method to fetch approvers for a document (custom logic needed here)
    private List<DocumentApprovalUserDto> getApproversForDocument(Document savedDocument) {
        // Fetch approvers based on your criteria (department, document type, etc.)
        List<DocumentApprovalUserDto> approvers = new ArrayList<>();

        // Step 1: Fetch Department Head Approvers & Reviewer
        List<DocumentApprovalUser> departmentHeadApprovers  = documentApprovalUserRepository.findByUserDepartmentId(savedDocument.getDocumentDepartment().getId());

        approvers.addAll(departmentHeadApprovers.stream()
                .map(approver -> modelMapper.map(approver, DocumentApprovalUserDto.class))
                .collect(Collectors.toList()));
        // Map the entity to DTOs and return

        // Step 2: Fetch Executive Level Approvers (based on criteria, such as role or department)
        List<DocumentApprovalUser> executiveApprovers = documentApprovalUserRepository
                .findByExecutiveUserApproval(DocumentApprovalUser.ApproverType.valueOf("Executive"));  // Assuming EXECUTIVE is a role

        approvers.addAll(executiveApprovers.stream()
                .map(approver -> modelMapper.map(approver, DocumentApprovalUserDto.class))
                .collect(Collectors.toList()));


        return approvers;
    }


    @Override
    public List<Document> getDocumentByDepartment(Long departmentId) {
        return documentRepository.findByDocumentDepartment_Id(departmentId);
    }

    @Override
    public List<DocumentDto> getAllDocumentes() {
        List<Document> documentes = documentRepository.findAll();
        return documentes.stream()
                .map(document -> modelMapper.map(document, DocumentDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentTypeDto> getAllDocumentTypes() {
        List<DocumentType> documentTypes=documentTypeRepository.findAll();

        return documentTypes.stream().map(documentType -> modelMapper.map(documentType,DocumentTypeDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDto getDocumentById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("The given document id not found"));
        return modelMapper.map(document, DocumentDto.class);
    }


    @Override
    public DocumentDto updateDocument(Long id, DocumentDto documentDTO, MultipartFile file) throws IOException {
        System.out.println("Entered updateDocument method: " + id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Department department = departmentRepository.findById(documentDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        DocumentType documentType = documentTypeRepository.findById(documentDTO.getDocumentTypeId())
                .orElseThrow(() -> new RuntimeException("Document Type not found"));

        if (auth == null || !auth.isAuthenticated()) {
            System.out.println("Authentication failed");
            throw new RuntimeException("User is not authenticated");
        }

        Optional<User> user = userRepository.findByUsername(auth.getName());

        if (!user.isPresent()) {
            System.out.println("User not found with username: " + auth.getName());
            throw new UsernameNotFoundException("User not found");
        }

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The given document id not found"));

        document.setTitle(documentDTO.getTitle());
        document.setContent(documentDTO.getContent());
        document.setApprovalStatus(Document.ApprovalStatus.valueOf(documentDTO.getApprovalStatus().toUpperCase()));
        document.setUpdatedDate(LocalDate.now());
        document.setUpdatedBy(user.get());
        document.setDocumentDepartment(department);
        document.setDocumentType(documentType);
        document.setIssueDate(documentDTO.getIssueDate());
        document.setEffectiveDate(document.getEffectiveDate());
        document.setReviewDate(document.getReviewDate());

        // Handle attachment updates
        List<Attachment> existingAttachments = attachmentRepository.findByDocumentId(id);

        // If a new file is uploaded, delete the old attachments and save the new one
        if (file != null && !file.isEmpty()) {
            // Delete existing attachments from both the file system and database
            for (Attachment attachment : existingAttachments) {
                java.io.File existingFile = new java.io.File(attachment.getFilePath());
                if (existingFile.exists()) {
                    if (existingFile.delete()) {
                        System.out.println("Deleted existing file: " + attachment.getFilePath());
                        // Remove the attachment from the database
                        attachmentRepository.delete(attachment);
                        System.out.println("Deleted attachment record from database: " + attachment.getFileName());
                    } else {
                        System.out.println("Failed to delete existing file: " + attachment.getFilePath());
                    }
                } else {
                    System.out.println("File not found, skipping deletion: " + attachment.getFilePath());
                    // Still remove the attachment record from the database even if the file isn't found
                    attachmentRepository.delete(attachment);
                    System.out.println("Deleted attachment record from database: " + attachment.getFileName());
                }
            }

            // Save the new file
            String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = "D:/uploads/" + uniqueFileName;
            java.io.File targetFile = new java.io.File(filePath);
            file.transferTo(targetFile);

            // Save the new attachment
            Attachment newAttachment = new Attachment();
            newAttachment.setFileName(uniqueFileName);
            newAttachment.setFilePath(filePath);
            newAttachment.setUploadDate(new Date());
            newAttachment.setDocument(document);
            attachmentRepository.save(newAttachment);
            System.out.println("New attachment saved: " + newAttachment.getFileName());
        } else {
            System.out.println("No new file uploaded, retaining existing attachments");
        }

        Document savedDocument = documentRepository.save(document);
        return modelMapper.map(savedDocument, DocumentDto.class);
       }

    @Override
    public DocumentDetailsDto getDocumentDetails(Long documentId) {
        // Fetch the document entity
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Fetch approval levels
        List<ApprovalLevel> approvalLevels = approvalLevelRepository.findByDocument_Id(documentId);

        // Convert approval levels to DTOs
        List<DocumentApprovalLevelDto> approvalLevelDtos = approvalLevels.stream()
                .map(level -> modelMapper.map(level,DocumentApprovalLevelDto.class

                ))
                .collect(Collectors.toList());

        // Fetch approval workflows
        List<ApprovalWorkflow> approvalWorkflows = documentApprovalWorkflowRepository.findByDocumentId(documentId);

        // Convert workflows to DTOs
        List<DocumentApprovalWorkFlowDto> workflowDtos = approvalWorkflows.stream()
                .map(workflow -> modelMapper.map(workflow,DocumentApprovalWorkFlowDto.class)
                ) .collect(Collectors.toList());

        // Map document fields to DTO fields
        return new DocumentDetailsDto(
                document.getId(),
                document.getTitle(),
                document.getApprovalStatus().name(),
                document.getCreatedBy().getName(), // Assuming createdBy is a User entity with a getName() method
                document.getCreatedDate(),
                document.getDocumentDepartment().getDepartName(), // Assuming department has a getName() method
                document.getDocumentType().getDocumentType(),
                approvalLevelDtos,
                workflowDtos
        );
    }

    @Override
    public Attachment handleFileUpload(MultipartFile file, Document document) throws IOException {
        // Generate a unique file name
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String filePath = "D:/uploads/" + uniqueFileName;

        // Save the file to the folder
        java.io.File targetFile = new java.io.File(filePath);
        file.transferTo(targetFile);

        // Create the Attachment entity
        Attachment attachment = new Attachment();
        attachment.setFileName(uniqueFileName); // Save the unique file name
        attachment.setFilePath(filePath);
        attachment.setUploadDate(new Date());
        attachment.setDocument(document); // Associate the file with the document

        return attachment;
    }
}
