package com.rayyansoft.DMS.service.Impl;


import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.*;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.repository.*;
import com.rayyansoft.DMS.service.DocumentService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.awt.image.BufferedImage;
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
        System.out.println("Creating document with title: service class " + documentDTO.getTitle());

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByUsername(auth.getName());
        if (!user.isPresent()) {
            throw new RuntimeException("User not authenticated or not found");
        }

        Department department = departmentRepository.findById(documentDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        DocumentType documentType = documentTypeRepository.findById(documentDTO.getDocumentTypeId())
                .orElseThrow(() -> new RuntimeException("Document type not found"));

        Document document = modelMapper.map(documentDTO, Document.class);
        document.setCreatedDate(LocalDate.now());
        document.setApprovalStatus(Document.ApprovalStatus.UNDER_REVIEW);
        document.setCreatedBy(user.get());
        document.setDocumentDepartment(department);
        document.setDocumentType(documentType);

        Document savedDocument = documentRepository.save(document);

        if (file != null && !file.isEmpty()) {
            System.out.println("File received: " + file.getOriginalFilename());

            try {
                // Save the attachment without text content initially
                Attachment attachmentEntity = handleFileUpload(file, savedDocument);
                attachmentEntity.setReferenceId(savedDocument.getId());
                attachmentEntity.setReferenceType("DMS");
                attachmentRepository.save(attachmentEntity);  // Save attachment to get ID

                // Extract text from the saved file directly
                String extractedText = extractTextFromFile(attachmentEntity.getFilePath());
                if (extractedText != null && !extractedText.isEmpty()) {
                    attachmentEntity.setContentText(extractedText);  // Update with extracted text
                    attachmentRepository.save(attachmentEntity);
                } else {
                    System.out.println("No text extracted from the file.");
                }

                System.out.println("Attachment saved with ID: " + attachmentEntity.getId());
            } catch (IOException e) {
                System.err.println("Error during file handling: " + e.getMessage());
            }
        } else {
            System.out.println("No file provided for upload.");
        }

        return modelMapper.map(savedDocument, DocumentDto.class);
    }


    public String extractTextFromFile(String filePath) throws IOException {
        StringBuilder extractedText = new StringBuilder();

        // Load the file directly from disk
        try (PDDocument document = PDDocument.load(new File(filePath))) {
            System.out.println("PDF successfully loaded from disk for extraction.");
            PDFTextStripper pdfStripper = new PDFTextStripper();

            for (int pageNum = 0; pageNum < document.getNumberOfPages(); pageNum++) {
                pdfStripper.setStartPage(pageNum + 1);
                pdfStripper.setEndPage(pageNum + 1);
                String pageText = pdfStripper.getText(document).trim();

                if (pageText.isEmpty()) {
                    System.out.println("No text found on page " + (pageNum + 1) + ", attempting OCR.");
                    pageText = extractTextWithOCR(new PDFRenderer(document), pageNum);
                } else {
                    System.out.println("Text extracted from page " + (pageNum + 1) + ": " + pageText);
                }

                extractedText.append(pageText).append("\n");
            }
        } catch (IOException e) {
            System.err.println("Error loading or parsing PDF with PDFBox: " + e.getMessage());
            throw e;
        }

        return extractedText.toString();
    }

    private String extractTextWithOCR(PDFRenderer pdfRenderer, int pageIndex) {
        String ocrText = "";

        try {
            // Render page as image for OCR
            BufferedImage image = pdfRenderer.renderImageWithDPI(pageIndex, 300); // 300 DPI for better OCR accuracy

            // Initialize Tesseract OCR
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("path_to_tessdata"); // Set the path to your tessdata directory

            // Perform OCR on the image
            ocrText = tesseract.doOCR(image);
            System.out.println("OCR extracted text: " + ocrText);
        } catch (IOException | TesseractException e) {
            System.err.println("Error during OCR processing on page " + (pageIndex + 1) + ": " + e.getMessage());
        }

        return ocrText;
    }
    private void createApprovalLevelsForDocument(Document savedDocument, List<DocumentApprovalUserDto> approvers) {
        int level = 1;
        for (DocumentApprovalUserDto approverDto : approvers) {
            // Create and set approval level details
            User user = userRepository.findById(approverDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            ApprovalLevel approvalLevel = new ApprovalLevel();
            approvalLevel.setDocument(savedDocument);
            approvalLevel.setApprover(user); // Map the DTO to the entity
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

        // If a new file is uploaded, delete old attachments and save the new one
        if (file != null && !file.isEmpty()) {
            // Delete existing attachments from both the file system and database
            for (Attachment attachment : existingAttachments) {
                java.io.File existingFile = new java.io.File(attachment.getFilePath());
                if (existingFile.exists() && existingFile.delete()) {
                    System.out.println("Deleted existing file: " + attachment.getFilePath());
                    attachmentRepository.delete(attachment); // Delete attachment record
                    System.out.println("Deleted attachment record from database: " + attachment.getFileName());
                } else {
                    System.out.println("File not found or failed to delete: " + attachment.getFilePath());
                    attachmentRepository.delete(attachment); // Delete attachment record even if file is missing
                }
            }

            // Save the new file
            String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = "D:/uploads/" + uniqueFileName;
            java.io.File targetFile = new java.io.File(filePath);
            file.transferTo(targetFile);

            // Extract text from the new file if it's a PDF
            String extractedText = "";


            // Save the new attachment with extracted text
            Attachment newAttachment = new Attachment();
            newAttachment.setFileName(uniqueFileName);
            newAttachment.setFilePath(filePath);
            newAttachment.setUploadDate(new Date());
            newAttachment.setDocument(document);
            newAttachment.setContentText(extractedText); // Store extracted text in contentText field
            attachmentRepository.save(newAttachment);
            System.out.println("New attachment saved with text extraction: " + newAttachment.getFileName());
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
        String uploadDir = "D:/Uploads/";
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + uniqueFileName;

        // Ensure the upload directory exists
        java.io.File uploadDirectory = new java.io.File(uploadDir);
        if (!uploadDirectory.exists()) {
            boolean dirCreated = uploadDirectory.mkdirs();
            System.out.println("Upload directory created: " + dirCreated);
        }

        // Save the file to the target directory
        java.io.File targetFile = new java.io.File(filePath);
        try {
            file.transferTo(targetFile);
            System.out.println("File successfully uploaded to: " + filePath);
        } catch (IOException e) {
            System.err.println("Failed to upload file: " + e.getMessage());
            throw e;
        }

        // Create and return the Attachment entity
        Attachment attachment = new Attachment();
        attachment.setFileName(uniqueFileName);
        attachment.setFilePath(filePath);
        attachment.setUploadDate(new Date());
        attachment.setDocument(document);
        return attachment;
    }
}
