package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Audit;
import com.rayyansoft.DMS.entity.AuditType;
import com.rayyansoft.DMS.entity.Status;
import com.rayyansoft.DMS.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AuditRepository extends JpaRepository<Audit,Long>, JpaSpecificationExecutor<Audit> {

    @Query("SELECT a FROM Audit a WHERE "
            + "(:title IS NULL OR a.title = :title) AND "
            + "(:statusId IS NULL OR a.statusId = :statusId) AND "
            + "(:auditType IS NULL OR a.auditType = :auditType) AND "
            + "(:startDate IS NULL OR a.assignedDate >= :startDate) AND "
            + "(:endDate IS NULL OR a.dueDate <= :endDate)")
    List<Audit> findByFilter(
            @Param("title") String title,
            @Param("statusId") Long statusId,
            @Param("auditType") String auditType,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // AuditRepository.java
    long count();


    @Transactional
    @Modifying
    @Query("UPDATE Audit a SET a.title = :title, a.assignedDate = :assignedDate, a.dueDate = :dueDate, a.statusId = :status, a.assignedToId = :assignedToId, a.updatedOn = CURRENT_DATE, a.updatedBy = :updatedBy,a.description=:description,a.auditType=:auditType WHERE a.id = :id")
    int updateAuditById(
            @Param("id") Long id,
            @Param("title") String title,
            @Param("assignedDate") LocalDate assignedDate,
            @Param("dueDate") LocalDate dueDate,
            @Param("status") Status status, // Expecting the Status object
            @Param("assignedToId") Long assignedToId,
            @Param("updatedBy") User updatedBy,  // Use updatedBy here instead of user
            @Param("description") String description,
            @Param("auditType")AuditType auditType);

}

