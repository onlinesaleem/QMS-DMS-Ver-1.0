package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.AttachmentDto;
import com.rayyansoft.DMS.entity.Attachment;
import com.rayyansoft.DMS.service.FileService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FilenameUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/files")
@AllArgsConstructor

public class FileController {



    @Autowired
    private  FileService fileService;

    // Path to the directory where files are stored
    private static final String FILE_DIRECTORY = "D:/Uploads/";
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Attachment> uploadFile(@RequestBody AttachmentDto attachmentDto) {
        Attachment file = fileService.uploadFile(attachmentDto);
        return ResponseEntity.ok(file);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getFileById(@PathVariable Long id) {
        Attachment file = fileService.getFileById(id);
        return ResponseEntity.ok(file);
    }

    @GetMapping
    public ResponseEntity<List<Attachment>> getAllFiles() {
        List<Attachment> files = fileService.getAllFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Attachment>> searchFiles(@RequestParam String keyword) {
        List<Attachment> matchedFiles = fileService.searchFilesByKeyword(keyword);
        return ResponseEntity.ok(matchedFiles);
    }

    @GetMapping("/api/files/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        System.out.println("the file management called...");
        try {
            // Define the path where the file is stored
            Path filePath = Paths.get("D:\\uploads").resolve(fileName).normalize();
            System.out.println("the path is "+filePath);
            // Load the file as a resource
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);

            // Set the content type and attachment header
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{documentId}/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long documentId, @PathVariable String fileName) {
        try {
            // Define the path where the file is stored
            Path filePath = Paths.get("D:\\uploads").resolve(fileName).normalize();
            System.out.println("the path is "+filePath);
            // Load the file as a resource
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);

            // Set the content type and attachment header
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
