package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.AuditResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuditResponseRepository extends JpaRepository<AuditResponse,Long> {

    List<AuditResponse> findByAuditId(Long auditId);

    @Query("select ar.respondedBy from AuditResponse ar where ar.audit.id=:auditId")
    Long findingResponseByAuditId(@Param("auditId") Long auditId);

    @Query("select ar from AuditResponse ar where ar.audit.id=:auditId")
    List<AuditResponse> searchRespondedUserByAuditId(@Param("auditId") Long auditId);

}
