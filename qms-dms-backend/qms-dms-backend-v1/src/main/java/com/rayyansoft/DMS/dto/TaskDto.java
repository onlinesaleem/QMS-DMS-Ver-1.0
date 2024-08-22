package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {

    private Long id;

    private Long assignedTo;

    private Long createdBy;

    private String createdOn;

    private Long taskTypeId;

    private Long taskReferenceId;

    private String taskNote;

    private String taskNumber;

    private String dueDate;


}
