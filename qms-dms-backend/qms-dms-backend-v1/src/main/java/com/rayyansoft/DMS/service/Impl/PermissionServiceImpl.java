package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.entity.Permission;
import com.rayyansoft.DMS.repository.PermissionRepository;
import com.rayyansoft.DMS.service.PermissionService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Getter
@Setter
@AllArgsConstructor
@Service
public class PermissionServiceImpl implements PermissionService {

    private PermissionRepository permissionRepository;

    @Override
    public Optional<Permission> findById(Long permissionId) {
        return permissionRepository.findById(permissionId);
    }
}
