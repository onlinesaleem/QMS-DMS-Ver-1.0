package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponseDto {

    private Long statusId;
    private String responseText;
    private Long respondedBy;
    private String updatedOn;
    private Boolean isUserFeedBackDone;
    private Long userFeedBackId;
    private String inProgressNotes;
}
