package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.Department;
import com.rayyansoft.DMS.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDto {
    private Long id;
    private String title;
    private String content;
    private Long departmentId;
    private String status;
    private String createdDate;
//    private User createdBy;
    private List<AttachmentDto> attachments;
    private Department documentDepartment;
}
