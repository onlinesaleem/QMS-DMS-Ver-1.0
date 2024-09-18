package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.ApprovalLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalLevelRepository extends JpaRepository<ApprovalLevel,Long> {


    List<ApprovalLevel> findByApproverIdAndStatus(Long approverId, ApprovalLevel.ApprovalStatus status);

    List<ApprovalLevel> findByDocument_Id(Long documentId);
}
