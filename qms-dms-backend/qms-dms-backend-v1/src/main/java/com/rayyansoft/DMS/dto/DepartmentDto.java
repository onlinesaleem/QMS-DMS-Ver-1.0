package com.rayyansoft.DMS.dto;

import jakarta.persistence.Column;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDto {

    private Long id;

    @Column(name="departName")
    private String departName;

    @Column(name="active")
    private Boolean active;
}
