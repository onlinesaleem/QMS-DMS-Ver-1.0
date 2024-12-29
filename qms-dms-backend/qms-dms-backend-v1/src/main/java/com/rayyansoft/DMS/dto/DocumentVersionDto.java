package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.Document;
import com.rayyansoft.DMS.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentVersionDto {



    private Long id;


    //private Document document;

    private int revisionNumber;


    private String content;


    //private User updatedBy;

    private LocalDate updatedDate;


    private String changeSummary;


    private Document.ApprovalStatus approvalStatus;


    private String attachments; // Optional, can store attachment references
}
