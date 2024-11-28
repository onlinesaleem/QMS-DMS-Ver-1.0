package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuditResponseDto {

    private Long id; // Response ID
    private Long auditId; // Audit ID that the response is associated with
    private String response; // The response text
    private LocalDate responseDate; // The date when the response was submitted

    private List<AttachmentDto> attachments; // List of attachment DTOs
}
