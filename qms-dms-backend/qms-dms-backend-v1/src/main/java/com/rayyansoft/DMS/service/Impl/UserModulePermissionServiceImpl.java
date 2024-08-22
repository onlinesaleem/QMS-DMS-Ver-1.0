package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.entity.Module;
import com.rayyansoft.DMS.entity.Permission;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.entity.UserModulePermission;
import com.rayyansoft.DMS.repository.UserModulePermissionRepository;
import com.rayyansoft.DMS.service.UserModulePermissionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
@Service
@AllArgsConstructor
public class UserModulePermissionServiceImpl implements UserModulePermissionService {

    @Autowired
    private UserModulePermissionRepository userModulePermissionRepository;
    @Override
    public List<UserModulePermission> getPermissionsByUser(User user) {
        return userModulePermissionRepository.findByUser(user);
    }

    @Override
    public UserModulePermission grantPermission(User user, Module module, Permission permission) {
        UserModulePermission ump = new UserModulePermission();
        ump.setUser(user);
        ump.setModule(module);
        ump.setPermission(permission);
        ump.setCreatedAt(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        return userModulePermissionRepository.save(ump);
    }

    @Override
    public List<Permission> findPermissionsByUserId(Long userId) {
        return userModulePermissionRepository.findPermissionsByUserId(userId);
    }



}
