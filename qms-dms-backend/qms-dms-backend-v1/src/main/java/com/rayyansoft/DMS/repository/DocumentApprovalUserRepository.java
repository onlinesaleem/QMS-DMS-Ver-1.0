package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.DocumentApprovalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentApprovalUserRepository extends JpaRepository<DocumentApprovalUser,Long> {

    @Query(value="select appruser from DocumentApprovalUser appruser where appruser.user.department.id=:val")
    List<DocumentApprovalUser> findByUserDepartmentId(@Param("val") Long departmentId);

    @Query("select executiveAppr from DocumentApprovalUser executiveAppr where executiveAppr.approverType = :val")
    List<DocumentApprovalUser> findByExecutiveUserApproval(@Param("val") DocumentApprovalUser.ApproverType approverType);





}
