package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuditFilterDto {

    private String auditType;
    private Long assignedToId;
    private Long statusId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String title;
    private LocalDate dueDate;
    private LocalDate assignedDate;
}
