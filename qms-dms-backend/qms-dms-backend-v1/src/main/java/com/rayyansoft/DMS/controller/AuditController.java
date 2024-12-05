package com.rayyansoft.DMS.controller;


import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.Audit;
import com.rayyansoft.DMS.service.AuditService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;


import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
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
                                                    @ModelAttribute AuditResponseDto response,
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


    @GetMapping("/audits/summary")
    public ResponseEntity<Map<String, Long>> getAuditSummary() {
        Map<String, Long> summary = auditService.getAuditSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/audits/export/excel")
    public ResponseEntity<InputStreamResource> exportAuditsToExcel() throws IOException {
        List<AuditDto> audits = auditService.getAllAudits();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Audits");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Audit Number");
        header.createCell(1).setCellValue("Title");
        header.createCell(2).setCellValue("Assigned Date");
        header.createCell(3).setCellValue("Due Date");

        int rowIndex = 1;
        for (AuditDto audit : audits) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(audit.getAuditNum());
            row.createCell(1).setCellValue(audit.getTitle());
            row.createCell(2).setCellValue(audit.getAssignedDate().toString());
            row.createCell(3).setCellValue(audit.getDueDate().toString());
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();

        ByteArrayInputStream inputStream = new ByteArrayInputStream(bos.toByteArray());
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=audits.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(new InputStreamResource(inputStream));
    }

    @GetMapping("/audits/export/pdf")
    public ResponseEntity<byte[]> exportAuditsToPdf() throws IOException {

        // Fetch the list of audits
        List<AuditDto> audits = auditService.getAllAudits();

        // Create a new PDF document
        PDDocument document = new PDDocument();

        // Set A4 page size
        PDRectangle pageSize = PDRectangle.A4;
        PDPage page = new PDPage(pageSize);
        document.addPage(page);

        // Prepare content stream
        PDPageContentStream contentStream = new PDPageContentStream(document, page);
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
        contentStream.setLeading(14.5f); // Line height (leading)

        // Define starting position (Y position for the first line of text)
        float margin = 25;
        float yStart = pageSize.getHeight() - 50; // Start from the top of the page
        float yPosition = yStart;

        // Add Title
        contentStream.newLineAtOffset(margin, yPosition);
        contentStream.showText("Audit List");
        yPosition -= 20;  // Move down after the title

        // Add Audit Details
        for (AuditDto audit : audits) {
            // Check if the text is going to overflow the page
            if (yPosition < 50) {
                contentStream.endText();
                contentStream.close();

                // Add new page if content overflows
                page = new PDPage(pageSize);
                document.addPage(page);
                contentStream = new PDPageContentStream(document, page);
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                contentStream.setLeading(14.5f);
                yPosition = pageSize.getHeight() - 50; // Reset y position for the new page
                contentStream.newLineAtOffset(margin, yPosition);
            }

            // Add each audit's details
            contentStream.showText("Audit Number: " + audit.getAuditNum());
            contentStream.newLine();
            contentStream.showText("Title: " + audit.getTitle());
            contentStream.newLine();
            contentStream.showText("Assigned Date: " + audit.getAssignedDate());
            contentStream.newLine();
            contentStream.showText("Due Date: " + audit.getDueDate());
            contentStream.newLine();
            contentStream.showText("Status: " + audit.getStatus());
            contentStream.newLine();
            contentStream.showText("Description: " + audit.getDescription());
            contentStream.newLine();
            contentStream.newLine();  // Add space between audits
            yPosition -= 80; // Adjust line spacing for next set of text
        }

        contentStream.endText();
        contentStream.close();

        // Write the document to a ByteArrayOutputStream
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        document.save(bos);
        document.close();

        // Set response headers for file download
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=audits.pdf");

        // Return the PDF as a byte array in the response
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(bos.toByteArray());
    }

    // Get monthly audit data
    @GetMapping("/monthly-audit-data")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyAuditData() {
        List<Map<String, Object>> monthlyData = auditService.getMonthlyAuditData();
        return ResponseEntity.ok(monthlyData);
    }

    // Get audit completion progress
    @GetMapping("/audit-completion-progress")
    public ResponseEntity<List<Map<String, Object>>> getAuditCompletionProgress() {
        List<Map<String, Object>> progressData = auditService.getAuditCompletionProgress();
        return ResponseEntity.ok(progressData);
    }
}
