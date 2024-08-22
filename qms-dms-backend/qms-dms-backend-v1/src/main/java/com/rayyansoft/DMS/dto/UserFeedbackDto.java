package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserFeedbackDto {

    private Long id;


    private String satisfactory;


    private String comments;


    private Long taskResponseId;


    private Long taskTypeId;


    private  String createdOn;

    private Long createdBy;

    private Boolean isFeedBackDone;


}
