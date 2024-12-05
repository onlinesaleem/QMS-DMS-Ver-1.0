package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.*;
import com.rayyansoft.DMS.repository.*;
import com.rayyansoft.DMS.service.AuditService;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuditServiceImpl implements AuditService {

    private AuditRepository auditRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;
    private StatusRepository statusRepository;
    private AuditTypeRepository auditTypeRepository;
    private AttachmentRepository attachmentRepository;
    private AuditResponseRepository auditResponseRepository;

    // Find User ID by Username
    public Long findUserIdByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return user.get().getId();
        } else {
            throw new RuntimeException("User not found with username: " + username);
        }
    }



    // Create a new Audit using AuditDto

    public AuditCreateDto createAuditWithAttachments(AuditCreateDto auditCreateDto, MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByUsername(auth.getName());
        if (!user.isPresent()) {
            throw new RuntimeException("User not authenticated or not found");
        }

        Long auditNum = auditRepository.count() + 1;

        // Map DTO to Entity
        Audit audit = modelMapper.map(auditCreateDto, Audit.class);
        audit.setCreatedOn(LocalDate.now());
        audit.setCreatedBy(user.get());
        audit.setAuditNum("AUD-" + auditNum);
        Audit savedAudit = auditRepository.save(audit);

        // Process Attachments
        if (file != null && !file.isEmpty()) {
            System.out.println("File received: " + file.getOriginalFilename());

            try {
                // Save the attachment without text content initially
                Attachment attachmentEntity = handleFileUploadForAudit(file, savedAudit);
                attachmentEntity.setReferenceId(savedAudit.getId());
                attachmentEntity.setReferenceType("AUD");

                // Extract text from the saved file directly
                String extractedText = extractTextFromFile(attachmentEntity.getFilePath());
                attachmentEntity.setContentText(extractedText);
                attachmentRepository.save(attachmentEntity);

                System.out.println("Attachment saved with ID: " + attachmentEntity.getId());
            } catch (IOException e) {
                System.err.println("Error during file handling: " + e.getMessage());
            }
        } else {
            System.out.println("No file provided for upload.");
        }

        // Map saved entity to AuditCreateDto
        return modelMapper.map(savedAudit, AuditCreateDto.class);
    }

    @Override
    public List<AttachmentDto> getAttachmentsForAudit(Long auditId) {
        List<Attachment> attachments = attachmentRepository.findByAuditId(auditId);
        return attachments.stream()
                .map(attachment -> modelMapper.map(attachment, AttachmentDto.class))
                .collect(Collectors.toList());
    }

    private String extractTextFromFile(String filePath) throws IOException {
        StringBuilder extractedText = new StringBuilder();
        try (PDDocument document = PDDocument.load(new File(filePath))) {
            PDFTextStripper pdfStripper = new PDFTextStripper();

            // Try extracting text from the PDF
            for (int pageNum = 0; pageNum < document.getNumberOfPages(); pageNum++) {
                pdfStripper.setStartPage(pageNum + 1);
                pdfStripper.setEndPage(pageNum + 1);
                String pageText = pdfStripper.getText(document).trim();

                // If no text is found, notify the user
                if (pageText.isEmpty()) {
                    pageText = "No text found on this page.";
                }

                extractedText.append(pageText).append("\n");
            }
        } catch (IOException e) {
            throw new IOException("Error during file processing: " + e.getMessage());
        }

        return extractedText.toString().isEmpty() ? "No content extracted." : extractedText.toString();
    }

    private Attachment handleFileUploadForAudit(MultipartFile file, Audit audit) throws IOException {
        // Log the file name and size for debugging
        System.out.println("File to upload: " + file.getOriginalFilename() + ", Size: " + file.getSize());

        // Define upload directory
        String uploadDir = "D:/Uploads/";
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            throw new IOException("File name cannot be null");
        }

        // Generate a unique file name
        String uniqueFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + "_" + originalFileName;

        String filePath = uploadDir + uniqueFileName;

        // Ensure the upload directory exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Save the file to the server
        File destinationFile = new File(filePath);
        file.transferTo(destinationFile);

        // Log the file path for debugging
        System.out.println("File saved at: " + filePath);

        // Create and return attachment entity
        Attachment attachment = new Attachment();
        attachment.setFileName(uniqueFileName); // Use the unique file name
        attachment.setFilePath(filePath);
        attachment.setUploadDate(new Date());
        attachment.setAudit(audit); // Associate with the Audit entity

        // Log the attachment details before saving
        System.out.println("Created Attachment entity: " + attachment);

        return attachment;
    }

    // Submit audit response with attachments
    public void submitAuditResponse(Long auditId, AuditResponseDto auditResponseDto, MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByUsername(auth.getName());


        // Handle the response saving logic
        Audit audit = auditRepository.findById(auditId)
                .orElseThrow(() -> new RuntimeException("Audit not found with ID: " + auditId));


        Status status=statusRepository.findById(auditResponseDto.getStatusId())
                .orElseThrow(()->new RuntimeException("Status id not found"));
        audit.setStatusId(status);
if (auditResponseDto.getStatusId()==3)
{
    audit.setCompletionDate(LocalDate.now());
}
        // Save the response (this could be a new entity, depending on your design)
        AuditResponse auditResponse = new AuditResponse();
        auditResponse.setAudit(audit);
        auditResponse.setResponse(auditResponseDto.getResponse());

        auditResponse.setResponseDate(LocalDate.now());
        auditResponse.setRespondedBy(user.get().getId());
        AuditResponse savedAuditReponse=auditResponseRepository.save(auditResponse);

        // Handle file upload if there's a file
        if (file != null) {
            Attachment attachment = handleFileUploadForAuditResponse(file, auditId);
            attachment.setAudit(audit);
            attachment.setReferenceId(savedAuditReponse.getId());
            attachment.setReferenceType("AUD-RESP");// Link to the audit

            String extractedText = extractTextFromFile(attachment.getFilePath());
            attachment.setContentText(extractedText);
            attachment.setAuditResponse(savedAuditReponse);
            attachmentRepository.save(attachment);
        }
    }

    @Transactional
    public AuditCreateDto updateAuditWithAttachments(Long auditId, AuditCreateDto auditCreateDto, MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByUsername(auth.getName());
        if (!user.isPresent()) {
            throw new RuntimeException("User not authenticated or not found");
        }

//        // Find the existing audit to update
//        Audit audit = auditRepository.findById(auditId)
//                .orElseThrow(() -> new RuntimeException("Audit not found"));
//
//        // Map updated values from the DTO to the existing audit entity
//        modelMapper.map(auditCreateDto, audit);
//        audit.setUpdatedOn(LocalDate.now());
//        audit.setUpdatedBy(user.get());
//
//        // Handle the AuditType reference manually to avoid modifying the ID
//        if (auditCreateDto.getAuditTypeId() != null) {
//            // Fetch the existing AuditType from the database using the ID in the DTO
//            AuditType auditType = auditTypeRepository.findById(auditCreateDto.getAuditTypeId())
//                    .orElseThrow(() -> new RuntimeException("AuditType not found"));
//            audit.setAuditType(auditType); // Set the existing AuditType entity
//        }
//        // Save the updated audit record
//        Audit updatedAudit = auditRepository.save(audit);

        // Fetch the updated audit from the database
        Audit updatedAudit = auditRepository.findById(auditId)
                .orElseThrow(() -> new RuntimeException("Audit not found after update"));

        // Get the updated user
        //String updatedBy = user.get().getUsername();
        User updatedBy=userRepository.findById(user.get().getId())
                .orElseThrow(()->new RuntimeException("user not found"));

        Status status=statusRepository.findById(auditCreateDto.getStatusId())
                .orElseThrow(()->new RuntimeException("Status not found"));

        AuditType auditType=auditTypeRepository.findById(auditCreateDto.getAuditTypeId())
                .orElseThrow(()->new RuntimeException("Audit type not found"));
        // Call the custom repository method to update the audit fields
        int updatedCount = auditRepository.updateAuditById(
                auditId,
                auditCreateDto.getTitle(),
                auditCreateDto.getAssignedDate(),
                auditCreateDto.getDueDate(),
                status,
                auditCreateDto.getAssignedToId(),
                updatedBy,
                auditCreateDto.getDescription(),
                auditType

        );

        if (updatedCount == 0) {
            throw new RuntimeException("Audit not found or failed to update");
        }

        List<Attachment> existingAttachments = attachmentRepository.findByAuditId(auditId);
        // Process Attachments (if new file is provided)
        if (file != null && !file.isEmpty()) {
            System.out.println("New file received: " + file.getOriginalFilename());
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

            try {
                // Delete the old file before uploading the new one


                // Save the new file
                Attachment attachmentEntity = handleFileUploadForAudit(file, updatedAudit);
                attachmentEntity.setReferenceId(updatedAudit.getId());
                attachmentEntity.setReferenceType("AUD");

                // Extract text from the saved file directly
                String extractedText = extractTextFromFile(attachmentEntity.getFilePath());
                attachmentEntity.setContentText(extractedText);
                attachmentRepository.save(attachmentEntity);

                System.out.println("New attachment saved with ID: " + attachmentEntity.getId());
            } catch (IOException e) {
                System.err.println("Error during file handling: " + e.getMessage());
            }
        }

        // Return the updated audit details as a DTO
        return modelMapper.map(updatedAudit, AuditCreateDto.class);
    }

    @Override
    public List<AuditResponseDto> getResponsesForAudit(Long auditId) {
        List<AuditResponse> auditResponses = auditResponseRepository.findByAuditId(auditId);

        return auditResponses.stream()
                .map(auditResponse -> modelMapper.map(auditResponse, AuditResponseDto.class))
                .collect(Collectors.toList());

    }

    @Override
    public AuditDetailDto getAuditDetails(Long auditId) {
        // Fetch the audit details
        Audit audit = auditRepository.findById(auditId)
                .orElseThrow(() -> new RuntimeException("Audit not found with ID: " + auditId));

        // Fetch the responses for this audit
        List<AuditResponse> responses = auditResponseRepository.findByAuditId(auditId);

        // Fetch the attachments for this audit
        List<Attachment> auditAttachments = attachmentRepository.findByAuditId(auditId);

        User user=userRepository.findById(audit.getCreatedBy().getId())
                .orElseThrow(()->new RuntimeException("user not found"));
        modelMapper.map(user,UserSummaryDto.class);





        Long respondedBy=auditResponseRepository.findingResponseByAuditId(auditId);

        System.out.println("the reported user id is "+respondedBy);

        User respondedUser=userRepository.findById(respondedBy)
                .orElseThrow(()->new RuntimeException("responded user not found"));



        // Fetch attachments for the responses using auditResponseId
        List<Attachment> responseAttachments = new ArrayList<>();
        for (AuditResponse response : responses) {
            responseAttachments.addAll(attachmentRepository.findByAuditResponseId(response.getId()));
        }

        // Create a combined list of attachments
        List<AttachmentDto> allAttachments = new ArrayList<>();
        allAttachments.addAll(modelMapper.map(auditAttachments, new TypeToken<List<AttachmentDto>>() {}.getType()));
        allAttachments.addAll(modelMapper.map(responseAttachments, new TypeToken<List<AttachmentDto>>() {}.getType()));

        // Map the audit and responses into a DTO
        AuditDetailDto auditDetailDto = modelMapper.map(audit, AuditDetailDto.class);
        auditDetailDto.setResponses(modelMapper.map(responses, new TypeToken<List<AuditResponseDto>>() {}.getType()));
        auditDetailDto.setRespondedBy(respondedUser.getName());
        auditDetailDto.setAttachments(allAttachments);

        return auditDetailDto;

    }

    @Override
    public Map<String, Long> getAuditSummary() {
        long totalAudits = auditRepository.count();
        long openAudits = auditRepository.countByStatus(1L);
        long closedAudits = auditRepository.countByStatus(3L);
        long dueAudits = auditRepository.countDueAudits();

        Map<String, Long> summary = new HashMap<>();
        summary.put("totalAudits", totalAudits);
        summary.put("openAudits", openAudits);
        summary.put("closedAudits", closedAudits);
        summary.put("dueAudits", dueAudits);

        return summary;
    }
    // Fetch monthly audit data (audit count by month)
    public List<Map<String, Object>> getMonthlyAuditData() {
        List<Object[]> results = auditRepository.findMonthlyAuditCount();  // Query to get monthly data
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", result[0]);
            map.put("count", result[1]);
            monthlyData.add(map);
        }
        return monthlyData;
    }

    // Fetch audit completion progress (completed audits by month)
    public List<Map<String, Object>> getAuditCompletionProgress() {
        List<Object[]> results = auditRepository.findAuditCompletionProgress();  // Query to get completion progress
        List<Map<String, Object>> progressData = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", result[0]);
            map.put("completed", result[1]);
            progressData.add(map);
        }
        return progressData;
    }


    private Attachment handleFileUploadForAuditResponse(MultipartFile file, Long auditId) throws IOException {
        // Handle file saving logic for audit response (similar to the original file handling)
        String uploadDir = "D:/Uploads/";
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + "_" + originalFileName;
        String filePath = uploadDir + uniqueFileName;

        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        File destinationFile = new File(filePath);
        file.transferTo(destinationFile);

        Attachment attachment = new Attachment();
        attachment.setFileName(uniqueFileName);
        attachment.setFilePath(filePath);
        attachment.setUploadDate(new Date());

        return attachment;
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

        return ocrText.trim();
    }




    // Get all Audits and return as List<AuditDto>
    public List<AuditDto> getAllAudits() {
        List<Audit> audits = auditRepository.findAll();

        return audits.stream()
                .map(audit -> modelMapper.map(audit, AuditDto.class))
                .collect(Collectors.toList());
    }

    // Get a single Audit by ID and return as AuditDto
    public AuditDto getAuditById(Long id) {
        Audit audit = auditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit not found with ID: " + id));
        return modelMapper.map(audit, AuditDto.class);
    }

    // Update an existing Audit

    // Delete an Audit by ID
    @Transactional
    public void deleteAudit(Long id) {
        if (!auditRepository.existsById(id)) {
            throw new RuntimeException("Audit not found with ID: " + id);
        }
        auditRepository.deleteById(id);
    }

    public List<AuditDto> filterAudits(AuditFilterDto filterDto) {
        Specification<Audit> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filterDto.getTitle() != null && !filterDto.getTitle().isEmpty()) {
                predicates.add(cb.like(root.get("title"), "%" + filterDto.getTitle() + "%"));
            }

            if (filterDto.getStatusId() != null) {
                predicates.add(cb.equal(root.get("status").get("id"), filterDto.getStatusId()));
            }

            if (filterDto.getAssignedToId() != null) {
                predicates.add(cb.equal(root.get("assignedToId"), filterDto.getAssignedToId()));
            }

            if (filterDto.getAssignedDate() != null) {
                predicates.add(cb.equal(root.get("assignedDate"), filterDto.getAssignedDate()));
            }

            if (filterDto.getDueDate() != null) {
                predicates.add(cb.equal(root.get("dueDate"), filterDto.getDueDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Audit> audits = auditRepository.findAll(specification);
        return audits.stream()
                .map(audit -> modelMapper.map(audit, AuditDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<AuditTypeDto> getAllAuditTypes() {
        List<AuditType> auditTypes=auditTypeRepository.findAll();
        return auditTypes.stream().map(audit->modelMapper.map(audit,AuditTypeDto.class))
                .collect(Collectors.toList());
    }




}


