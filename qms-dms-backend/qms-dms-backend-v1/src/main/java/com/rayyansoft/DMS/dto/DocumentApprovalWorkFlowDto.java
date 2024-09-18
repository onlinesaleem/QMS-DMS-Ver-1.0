package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentApprovalWorkFlowDto {


    private Long id;


   // private Document document;


    private UserDetailsDto user;  // The user who performed the action (reviewed/approved/rejected)



    private String action;  // REVIEWED, APPROVED, REJECTED


    private LocalDateTime timestamp;  // When the action occurred


    private String comments;  // Optional rejection reason or review notes


    private int level; // Represents the approval level (e.g., 1, 2, 3)


}
