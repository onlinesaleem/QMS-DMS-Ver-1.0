package com.rayyansoft.DMS.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditTemplateResponseDto {

    private Long id;
    private String name;
    private String departmentName;
    private String createdBy;
    private LocalDate createdDate;
}
