package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.AttachmentDto;
import com.rayyansoft.DMS.entity.Attachment;
import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.repository.AttachmentRepository;
import com.rayyansoft.DMS.repository.DocumentRepository;
import com.rayyansoft.DMS.service.FileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class FileServiceImpl implements FileService {


    private final AttachmentRepository fileRepository;
    private final DocumentRepository documentRepository;

    @Override
    public Attachment uploadFile(AttachmentDto fileDTO) {
        Attachment attachment = new Attachment();
        attachment.setFileName(fileDTO.getFileName());
        attachment.setFilePath(fileDTO.getFilePath());
        attachment.setUploadDate(new Date());
        attachment.setContentText("test saving...");

        Document document = documentRepository.findById(fileDTO.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found"));
        attachment.setDocument(document);

        return fileRepository.save(attachment);
    }

    @Override
    public Attachment getFileById(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    @Override
    public List<Attachment> getAllFiles() {
        return fileRepository.findAll();
    }

    @Override
    public List<Attachment> searchFilesByKeyword(String keyword) {
        return fileRepository.findByContentTextContainingIgnoreCase(keyword);
    }
}
