package com.rayyansoft.DMS.service.Impl;


import com.rayyansoft.DMS.dto.AttachmentDto;
import com.rayyansoft.DMS.dto.DocumentDto;
import com.rayyansoft.DMS.entity.Attachment;
import com.rayyansoft.DMS.entity.Department;
import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.repository.AttachmentRepository;
import com.rayyansoft.DMS.repository.DepartmentRepository;
import com.rayyansoft.DMS.repository.DocumentRepository;
import com.rayyansoft.DMS.repository.UserRepository;
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

    @Override
    public DocumentDto createDocument(DocumentDto documentDTO, AttachmentDto attachmentDTO, MultipartFile file) throws IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Department department = departmentRepository.findById(documentDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        Document document = modelMapper.map(documentDTO, Document.class);
        document.setCreatedDate(LocalDate.now());
        document.setStatus(Document.DocumentStatus.DRAFT);
       document.setCreatedBy(user.get());
       document.setDocumentDepartment(department);

        // Handle file attachment (if provided)
        // Handle file attachment (if provided)
        if (file != null) {
            // Generate a unique file name
            String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = "D:/uploads/" + uniqueFileName;

            // Save the file to the folder
            java.io.File targetFile = new java.io.File(filePath);
            file.transferTo(targetFile);

            // Create the File entity and set the details
            Attachment attachmentEntity = new Attachment();
            attachmentEntity.setFileName(uniqueFileName); // Save the unique file name
            attachmentEntity.setFilePath(filePath);
            attachmentEntity.setUploadDate(new Date());
            attachmentEntity.setDocument(document); // Associate the File with the Document

            document.setAttachments(Collections.singletonList(attachmentEntity)); // Set the file(s) for the Document
        }



        Document savedDocument = documentRepository.save(document);
        return modelMapper.map(savedDocument, DocumentDto.class);
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
    public DocumentDto getDocumentById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("The given document id not found"));
        return modelMapper.map(document, DocumentDto.class);
    }


    @Override
    public DocumentDto updateDocument(Long id, DocumentDto documentDTO, MultipartFile file) throws IOException {
        System.out.println("Entered updateDocument method" + id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Department department = departmentRepository.findById(documentDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        if (auth == null || !auth.isAuthenticated()) {
            System.out.println("Authentication failed");
            throw new RuntimeException("User is not authenticated");
        }
        System.out.println("Authentication successful");

        Optional<User> user = userRepository.findByUsername(auth.getName());

        System.out.println("Retrieved user: " + auth.getName());
        if (!user.isPresent()) {
            System.out.println("User not found with username: " + auth.getName());

            throw new UsernameNotFoundException("User not found");
        }

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The given document id not found"));
        System.out.println("Document found: " + document.getId());
        if (user.get().getName() == null) {
            System.out.println("User's name is null");
            throw new RuntimeException("User's name is null");
        }

        document.setTitle(documentDTO.getTitle());
        System.out.println("Title set to: " + documentDTO.getTitle());
        document.setContent(documentDTO.getContent());
        System.out.println("Content set to: " + documentDTO.getContent());
        document.setStatus(Document.DocumentStatus.valueOf(documentDTO.getStatus().toUpperCase()));
        System.out.println("Status set to: " + documentDTO.getStatus());
        document.setUpdatedDate(LocalDate.now());
        document.setUpdatedBy(user.get());
        document.setDocumentDepartment(department);

        // Handle attachment updates
        List<Attachment> existingAttachments = attachmentRepository.findByDocumentId(id);
        System.out.println("Existing attachments: " + existingAttachments.size());

        // If a new file is uploaded, delete the old attachments and save the new one
        if (file != null && !file.isEmpty()) {
            // Delete existing attachments
            String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = "D:/uploads/" + uniqueFileName;
            attachmentRepository.deleteByDocumentId(id);
            System.out.println("Deleted existing attachments for document ID: " + id);
            // Save the file to the folder
            java.io.File targetFile = new java.io.File(filePath);
            file.transferTo(targetFile);
            // Save the new attachment
            Attachment newAttachment = new Attachment();
            newAttachment.setFileName(uniqueFileName);
            newAttachment.setFilePath(filePath); // Update with your file path logic
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
}
