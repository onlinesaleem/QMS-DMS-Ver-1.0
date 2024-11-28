package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.AuditSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditScheduleRepository extends JpaRepository<AuditSchedule,Long> {
}
