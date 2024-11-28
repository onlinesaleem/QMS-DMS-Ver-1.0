package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Attachment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment,Long> {

    @Query(value = "SELECT * FROM dms_attachment WHERE document_id = :documentId", nativeQuery = true)
    List<Attachment> findByDocumentId(@Param("documentId") Long documentId);

    @Query(value = "SELECT * FROM dms_attachment WHERE audit_id = :auditId", nativeQuery = true)
    List<Attachment> findByAuditId(@Param("auditId") Long auditId);

    @Query(value = "SELECT * FROM dms_attachment WHERE audit_response_id = :auditResponseId", nativeQuery = true)
    List<Attachment> findByAuditResponseId(@Param("auditResponseId") Long auditResponseId);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM dms_attachment WHERE document_id = :documentId", nativeQuery = true)
    void deleteByDocumentId(@Param("documentId") Long documentId);

    // Method to search for attachments by keyword in contentText
    List<Attachment> findByContentTextContainingIgnoreCase(String keyword);

    List<Attachment> findByReferenceIdAndReferenceType(Long referenceId, String referenceType);
}
