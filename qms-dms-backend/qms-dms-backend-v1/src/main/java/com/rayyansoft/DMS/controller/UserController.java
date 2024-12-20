package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.UserSummaryDto;
import com.rayyansoft.DMS.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin("*")
@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;

    @GetMapping("/find-user-id")
    public ResponseEntity<?> findUserIdByUsernameOrEmail() {
       Long userId=userService.findUserIdByUsernameOrEmail();
        if (userId == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userId, HttpStatus.OK);
    }


    @GetMapping("/userSummary")
    public ResponseEntity<?> findUserSummary(){
        List<UserSummaryDto> userSummaryDtoList=userService.findAllUserSummary();
        return  ResponseEntity.ok(userSummaryDtoList);
    }

}
