package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.ApprovalWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow,Long> {

    List<ApprovalWorkflow> findByDocumentId(Long documentId);


}
