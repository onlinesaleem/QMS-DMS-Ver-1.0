package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name="dms.approval_user")
public class DocumentApprovalUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name="approverType")
    private ApproverType approverType;

    public enum ApproverType{
        Doc_Preparedby,
        Doc_Reviewer,
        Doc_Approver,
        Executive
    }

    @Column(name="active")
    private boolean active;
}
