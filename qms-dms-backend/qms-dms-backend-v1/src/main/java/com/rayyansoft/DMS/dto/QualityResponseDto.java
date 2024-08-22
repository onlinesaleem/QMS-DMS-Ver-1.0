package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QualityResponseDto {

    private Long id;


    private Long incId;


    private String notes;


    private String finalActionTaken;


    private String ifNotAppropriate;


    private String updatedOn;


    private Long updatedUserId;
}
