package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.Attachment;
import com.rayyansoft.DMS.entity.Audit;
import com.rayyansoft.DMS.entity.AuditResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
public interface AuditService {

    public Long findUserIdByUsername(String username);

    public List<AuditDto> getAllAudits();
    public AuditDto getAuditById(Long id);

    public void deleteAudit(Long id);

    public List<AuditDto> filterAudits(AuditFilterDto filterDto);

    public List<AuditTypeDto> getAllAuditTypes();

    public AuditCreateDto createAuditWithAttachments(AuditCreateDto auditCreateDto, MultipartFile files) throws IOException;

    public List<AttachmentDto> getAttachmentsForAudit(Long auditId) ;

    public void submitAuditResponse(Long auditId, String response, MultipartFile file) throws IOException;

    public AuditCreateDto updateAuditWithAttachments(Long auditId, AuditCreateDto auditCreateDto, MultipartFile file) throws IOException ;



    public List<AuditResponseDto> getResponsesForAudit(Long auditId);


    public AuditDetailDto getAuditDetails(Long auditId);
}
