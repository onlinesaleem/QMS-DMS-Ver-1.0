package com.rayyansoft.DMS.dto;

import com.rayyansoft.DMS.entity.DocumentApprovalUser;
import com.rayyansoft.DMS.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentApprovalUserSummaryDto {

    private Long id;  // DocumentApprovalUser ID

    private Long userId;  // Store only user ID

    private String name;  // Store only user name

    private DocumentApprovalUser.ApproverType approverType;  // Enum type for approverType

    private Boolean active;  // Use Boolean wrapper type, not primitive boolean




}
