package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.entity.Permission;


import java.util.Optional;

public interface PermissionService {

    Optional<Permission> findById(Long permissionId);
}
