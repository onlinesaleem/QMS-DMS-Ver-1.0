package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AuthService {
    String register(RegisterDto registerDto);


    JwtAuthResponse login(LoginDto loginDto);

    Long findByUserId(String userName);



    Page<User> fetchAllUser(int page, int size);

    List<DepartmentDto> getAllDepartment();

   UserDto fetchUserDetailsByUserId(Long userId);

    void updateUserPassword(Long userId,UserDto userDto);
   void updateProfile(Long userId,UserDto userDto);

   UserDto findByEmail(Long userId);



}
