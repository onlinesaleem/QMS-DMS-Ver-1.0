package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.Status;
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
public class AuditDetailDto {

    private Long id;
    private String title;
    private String description;
    private LocalDate assignedDate;
    private LocalDate dueDate;
    private Status status;

    private List<AuditResponseDto> responses; // List of audit responses
    private List<AttachmentDto> attachments; // List of attachments

}
