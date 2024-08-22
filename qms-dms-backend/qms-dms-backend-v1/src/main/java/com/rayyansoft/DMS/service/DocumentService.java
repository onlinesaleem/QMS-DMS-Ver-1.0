package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.AttachmentDto;
import com.rayyansoft.DMS.dto.DocumentDto;
import com.rayyansoft.DMS.entity.Document;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DocumentService {

    public DocumentDto createDocument(DocumentDto documentDto, AttachmentDto attachmentDTO, MultipartFile files) throws IOException;

    public List<Document> getDocumentByDepartment(Long departmentId);

    public List<DocumentDto> getAllDocumentes();

    public DocumentDto getDocumentById(Long documentId);

    DocumentDto updateDocument(Long id, DocumentDto documentDTO, MultipartFile file) throws IOException;
}
