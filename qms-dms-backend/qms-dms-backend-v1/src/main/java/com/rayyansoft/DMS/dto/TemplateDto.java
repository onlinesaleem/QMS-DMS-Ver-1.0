package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TemplateDto {

    private Long id;
    private String name;
    private String content;
    private Long departmentId;
    private User createdBy;
    private LocalDate createdDate;
    private User updatedBy;
    private LocalDate updatedDate;
}
