package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.AttachmentDto;
import com.rayyansoft.DMS.entity.Attachment;

import java.util.List;

public interface FileService {

    public Attachment uploadFile(AttachmentDto fileDTO);

    public Attachment getFileById(Long id);

    public List<Attachment> getAllFiles();

    public List<Attachment> searchFilesByKeyword(String keyword);

}
