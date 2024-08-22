package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentDto {

    private String fileName;
    private String filePath;
    private Date uploadDate;
    private Long documentId;


    // Getters and setters

}
