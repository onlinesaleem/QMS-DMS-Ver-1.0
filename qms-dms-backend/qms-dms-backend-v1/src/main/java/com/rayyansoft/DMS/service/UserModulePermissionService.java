package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.entity.Module;
import com.rayyansoft.DMS.entity.Permission;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.entity.UserModulePermission;

import java.util.List;

public interface UserModulePermissionService {
    List<UserModulePermission> getPermissionsByUser(User user);
     UserModulePermission grantPermission(User user, Module module, Permission permission);

    List<Permission> findPermissionsByUserId(Long userId);



}
