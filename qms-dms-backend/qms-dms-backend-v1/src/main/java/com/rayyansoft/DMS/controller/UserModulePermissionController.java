package com.rayyansoft.DMS.controller;


import com.rayyansoft.DMS.dto.GrantPermissionRequestDto;
import com.rayyansoft.DMS.entity.Module;
import com.rayyansoft.DMS.entity.Permission;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.entity.UserModulePermission;
import com.rayyansoft.DMS.service.ModuleService;
import com.rayyansoft.DMS.service.PermissionService;
import com.rayyansoft.DMS.service.UserModulePermissionService;
import com.rayyansoft.DMS.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@AllArgsConstructor
@RequestMapping("/api/user-module-permissions")
public class UserModulePermissionController {

    private UserModulePermissionService userModulePermissionService;


    private UserService userService;


    private ModuleService moduleService;


    private PermissionService permissionService;

    @PostMapping("/grant")
    public ResponseEntity<?> grantPermission(@RequestBody GrantPermissionRequestDto request) {
        Optional<User> userOpt = userService.findByUserId(request.getUserId());
        if (!userOpt.isPresent()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        User user = userOpt.get();

        Optional<Module> moduleOpt = moduleService.findById(request.getModuleId());
        if (!moduleOpt.isPresent()) {
            return new ResponseEntity<>("Module not found", HttpStatus.NOT_FOUND);
        }

        Module module = moduleOpt.get();

        Optional<Permission> permissionOpt = permissionService.findById(request.getPermissionId());
        if (!permissionOpt.isPresent()) {
            return new ResponseEntity<>("Permission not found", HttpStatus.NOT_FOUND);
        }

        Permission permission = permissionOpt.get();

        UserModulePermission ump = userModulePermissionService.grantPermission(user, module, permission);
        return new ResponseEntity<>(ump, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}/permissions")
    public ResponseEntity<?> getUserPermissions(@PathVariable Long userId) {
        List<Permission> permissions = userModulePermissionService.findPermissionsByUserId(userId);
        if (permissions.isEmpty()) {
            return new ResponseEntity<>("No permissions found for user", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(permissions, HttpStatus.OK);
    }
}
