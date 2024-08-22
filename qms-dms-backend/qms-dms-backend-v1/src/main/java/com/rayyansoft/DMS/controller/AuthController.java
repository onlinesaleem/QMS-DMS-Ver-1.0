package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        String response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto) {
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);

        return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
    }

    @GetMapping("/findByUsername/{userName}")
    public Long findByUsername(@PathVariable("userName") String userName) {
        return authService.findByUserId(userName);
    }


    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @PutMapping("/updatePassword/{userId}")
    public ResponseEntity<String> updateUserPassword(@PathVariable("userId") Long userId, @RequestBody UserDto userDto) {
        authService.updateUserPassword(userId, userDto);
        return ResponseEntity.ok("updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateProfile/{userId}")
    public ResponseEntity<String> updateProfile(@PathVariable("userId") Long userId, @RequestBody UserDto userDto) {

        authService.updateProfile(userId,userDto);;
        return ResponseEntity.ok("updated successfully");


    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/userList")
    public Page<User> findAllUser(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        return authService.fetchAllUser(page, size);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/findProfile/{userId}")
    public UserDto findProfile(@PathVariable("userId") Long userId) {
        return authService.fetchUserDetailsByUserId(userId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/departmentList")
    public ResponseEntity<List<DepartmentDto>> fetchAllDepartment() {

        List<DepartmentDto> departmentDtos = authService.getAllDepartment();

        return ResponseEntity.ok(departmentDtos);

    }



}
