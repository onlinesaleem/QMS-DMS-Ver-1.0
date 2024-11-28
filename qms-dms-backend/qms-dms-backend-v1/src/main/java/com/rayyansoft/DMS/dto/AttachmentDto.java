package com.rayyansoft.DMS.dto;

import jakarta.persistence.Column;
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
    private Long auditId;
    private String contentText;

    private Long referenceId; // ID of the referenced entity (e.g., Document, Audit, etc.)


    private String referenceType; // Type of reference (e.g., "DOCUMENT", "AUDIT")


    // Getters and setters

}
