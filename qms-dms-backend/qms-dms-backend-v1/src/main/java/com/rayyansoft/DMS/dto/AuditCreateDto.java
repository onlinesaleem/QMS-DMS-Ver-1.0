package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.AuditType;
import com.rayyansoft.DMS.entity.Status;
import com.rayyansoft.DMS.entity.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class AuditCreateDto {
    private Long id;

    @NotNull(message = "Audit name is required")
    @Size(min = 3, max = 100, message = "Audit name must be between 3 and 100 characters")
    private String title;

    @NotNull(message = "Audit type is required")
    private Long auditTypeId;

    @NotNull(message = "Assigned date is required")
    private LocalDate assignedDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private LocalDate createdOn;
    private LocalDate updatedOn;
    private LocalDate completionDate;

    private Long assignedToId;


    private String auditNum;
    private String description;
    private Long statusId;

    private Long departmentId;

    private List<AttachmentDto> attachments;




}
