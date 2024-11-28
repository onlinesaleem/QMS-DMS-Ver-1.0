package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.AuditResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditResponseRepository extends JpaRepository<AuditResponse,Long> {

    List<AuditResponse> findByAuditId(Long auditId);
}
