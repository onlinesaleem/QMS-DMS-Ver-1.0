package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentApprovalUserDto {



    private Long id;


    private User user;


    private String approverType;


    private boolean active;
}
