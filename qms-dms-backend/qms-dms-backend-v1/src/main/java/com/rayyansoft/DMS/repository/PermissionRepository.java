package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission,Long> {
}
