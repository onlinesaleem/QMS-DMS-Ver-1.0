package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.dto.DocumentApprovalUserSummaryDto;
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

    @Query("select new com.rayyansoft.DMS.dto.DocumentApprovalUserSummaryDto(appruser.id, appruser.user.id, appruser.user.name, appruser.approverType, appruser.active) " +
            "from DocumentApprovalUser appruser")
    List<DocumentApprovalUserSummaryDto> findApproverUserAll();

    boolean existsByUserIdAndApproverType(Long userId, DocumentApprovalUser.ApproverType approverType);


}
