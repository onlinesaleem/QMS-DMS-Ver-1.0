package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.Audit;
import com.rayyansoft.DMS.service.AuditService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audits")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @Autowired
    private ModelMapper modelMapper;




    @PostMapping("/create-with-attachment")
    public ResponseEntity<AuditCreateDto> createAudit(
            @ModelAttribute @Valid AuditCreateDto auditCreateDto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        AuditCreateDto createdAudit = auditService.createAuditWithAttachments(auditCreateDto, file);
        System.out.println("Audit created with attachments.");
        return ResponseEntity.ok(createdAudit);
    }

    // Endpoint to fetch attachments for a given audit
    @GetMapping("/{auditId}/attachments")
    public ResponseEntity<List<AttachmentDto>> getAttachmentsForAudit(@PathVariable Long auditId) {
        List<AttachmentDto> attachments = auditService.getAttachmentsForAudit(auditId);
        return ResponseEntity.ok(attachments);
    }

    // Endpoint to submit an audit response with an optional file attachment
    @PostMapping("/{auditId}/responses")
    public ResponseEntity<Void> submitAuditResponse(@PathVariable Long auditId,
                                                    @RequestParam String response,
                                                    @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        auditService.submitAuditResponse(auditId, response, file);
        return ResponseEntity.ok().build();
    }



    @GetMapping
    public ResponseEntity<List<AuditDto>> getAll(){
        List<AuditDto> audit=auditService.getAllAudits();
        return  ResponseEntity.ok(audit);
    }
    // Get a single Audit by ID
    @GetMapping("/{id}")
    public ResponseEntity<AuditDto> getAuditById(@PathVariable Long id) {
        AuditDto audit = auditService.getAuditById(id);
        return ResponseEntity.ok(audit);
    }

    // Update an existing Audit


    @PutMapping("/audits/{auditId}")
    public ResponseEntity<AuditCreateDto> updateAudit(
            @ModelAttribute AuditCreateDto auditCreateDto,
            @PathVariable Long auditId,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        System.out.println("the audit type id is ..."+auditCreateDto.getAuditTypeId());
        // Call the service method to update the audit
        AuditCreateDto updatedAudit = auditService.updateAuditWithAttachments(auditId, auditCreateDto, file);

        return ResponseEntity.ok(updatedAudit); // Return the updated audit DTO
    }

    // Delete an Audit by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAudit(@PathVariable Long id) {
        auditService.deleteAudit(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/filter")
    public ResponseEntity<List<AuditDto>> filterAudits(@RequestBody AuditFilterDto filterDto) {
        List<AuditDto> audits = auditService.filterAudits(filterDto);
        return ResponseEntity.ok(audits);
    }
    // Serve files through an endpoint
    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get("D:/Uploads/").resolve(filename).normalize();
        Resource resource = (Resource) new FileSystemResource(filePath);

        if (!((FileSystemResource) resource).exists()) {
            throw new FileNotFoundException("File not found " + filename);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF) // Change the media type based on the file type
                .body(resource);
    }
    @GetMapping("/auditTypes")
    public List<AuditTypeDto> getAllAuditTypes(){
        return  auditService.getAllAuditTypes();
    }


    // Get Responses for a Specific Audit
    @GetMapping("/{auditId}/responses")
    public ResponseEntity<List<AuditResponseDto>> getAuditResponses(@PathVariable Long auditId) {
        List<AuditResponseDto> responses = auditService.getResponsesForAudit(auditId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{auditId}/details")
    public ResponseEntity<AuditDetailDto> getAuditDetails(@PathVariable Long auditId) {
        AuditDetailDto auditDetail = auditService.getAuditDetails(auditId);
        return ResponseEntity.ok(auditDetail);
    }
}
