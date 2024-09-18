package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDto {
    private String name;
    private String username;
    private String email;

    private Long empNumber;
    private Long departmentId;
    private String departmentName;
}
