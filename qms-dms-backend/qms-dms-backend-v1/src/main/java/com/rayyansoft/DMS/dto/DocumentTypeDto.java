package com.rayyansoft.DMS.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentTypeDto {

    private Long id;


    private String documentType;


    private Boolean active;
}
