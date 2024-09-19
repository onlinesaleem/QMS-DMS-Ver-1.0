package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.Attachment;
import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.entity.DocumentType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DocumentService {

    public DocumentDto createDocument(DocumentDto documentDto, AttachmentDto attachmentDTO, MultipartFile files) throws IOException;

    public List<Document> getDocumentByDepartment(Long departmentId);

    public List<DocumentDto> getAllDocumentes();

    public List<DocumentTypeDto> getAllDocumentTypes();


    public DocumentDto getDocumentById(Long documentId);

    DocumentDto updateDocument(Long id, DocumentDto documentDTO, MultipartFile file) throws IOException;

    DocumentDetailsDto getDocumentDetails(Long documentId);

     Attachment handleFileUpload(MultipartFile file, Document document) throws IOException;

}
