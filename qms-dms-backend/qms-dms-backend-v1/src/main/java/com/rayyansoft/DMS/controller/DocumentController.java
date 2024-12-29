package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.AttachmentDto;
import com.rayyansoft.DMS.dto.DocumentDetailsDto;
import com.rayyansoft.DMS.dto.DocumentDto;
import com.rayyansoft.DMS.dto.DocumentTypeDto;
import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.service.DocumentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    @PostMapping
    public ResponseEntity<DocumentDto> createDocument( @ModelAttribute DocumentDto documentDto,
                                                      @RequestPart("file") MultipartFile file) throws IOException {


        System.out.println("document creation method called"+documentDto.getTitle());
        // Define the path where files will be saved
        String uploadDir = "D:/uploads/";
        Path filePath = Paths.get(uploadDir, file.getOriginalFilename());

        try {
            // Save the file to the folder
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }

        // Prepare FileDTO for saving file details in the database
        AttachmentDto attachmentDto = new AttachmentDto();
        attachmentDto.setFileName(file.getOriginalFilename());
        attachmentDto.setFilePath(filePath.toString()); // Use the actual path where the file was saved


        // Create the document along with file information
        DocumentDto document = documentService.createDocument(documentDto, attachmentDto,file);
        System.out.println("the approval information is"+document.getApprovalStatus());
        return ResponseEntity.ok(document);
    }

    @GetMapping("/department/{departmentId}")
    public List<Document> getDocumentByDepartment(@PathVariable Long departmentId) {
        return documentService.getDocumentByDepartment(departmentId);
    }

    @GetMapping("/document-types")
    public List<DocumentTypeDto> getDocumentTypes(){
        return  documentService.getAllDocumentTypes();
    }


    @GetMapping
    public ResponseEntity<List<DocumentDto>> getAlldocuments() {
        List<DocumentDto> documentDtos = documentService.getAllDocumentes();
        return new ResponseEntity<>(documentDtos, HttpStatus.OK);
    }

    @GetMapping("/{documentId}/details")
    public ResponseEntity<DocumentDetailsDto> getDocumentDetails(@PathVariable Long documentId) {
        DocumentDetailsDto documentDetails = documentService.getDocumentDetails(documentId);
        return ResponseEntity.ok(documentDetails);
    }
    @GetMapping("/document/{documentId}")
    public DocumentDto getDocumentById(@PathVariable Long documentId) {
        return documentService.getDocumentById(documentId);
    }

    @PutMapping("/document/{id}")
    public ResponseEntity<DocumentDto> updateDocument(@ModelAttribute DocumentDto documentDto,@PathVariable Long id,

                                                      @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {


        DocumentDto savedDocument = documentService.updateDocument(id,documentDto, file);
        return ResponseEntity.ok(savedDocument);
    }


}
