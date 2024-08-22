package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Permission;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.entity.UserModulePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserModulePermissionRepository extends JpaRepository<UserModulePermission, Long> {

    List<UserModulePermission> findByUser(User user);
    List<UserModulePermission> findByModule(Module module);
    List<UserModulePermission> findByPermission(Permission permission);


    @Query("SELECT ump.permission FROM UserModulePermission ump WHERE ump.user.id = :userId")
    List<Permission> findPermissionsByUserId(Long userId);
}
