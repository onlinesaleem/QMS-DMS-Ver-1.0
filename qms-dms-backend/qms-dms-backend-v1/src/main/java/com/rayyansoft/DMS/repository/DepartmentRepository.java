package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department,Long> {
}
