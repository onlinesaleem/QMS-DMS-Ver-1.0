package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name="userFeedback")
public class UserFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="satisfactory")
    private String satisfactory;

    @Column(name="comments")
    private String comments;

    @Column(name="taskResponseId")
    private Long taskResponseId;

    @Column(name="taskTypeId")
    private Long taskTypeId;

    @Column(name="createdOn")
    private  String createdOn;

    @Column(name="createdBy")
    private Long createdBy;

    @Column(name="isFeedBackDone")
    private Boolean isFeedBackDone;



    public void setId(Long id) {
        this.id = id;
    }

    public void setSatisfactory(String satisfactory) {
        this.satisfactory = satisfactory;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public void setTaskResponseId(Long taskResponseId) {
        this.taskResponseId = taskResponseId;
    }

    public void setTaskTypeId(Long taskTypeId) {
        this.taskTypeId = taskTypeId;
    }

    public void setCreatedOn(String createdOn) {
        this.createdOn = createdOn;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }





    public void setFeedBackDone(Boolean feedBackDone) {
        isFeedBackDone = feedBackDone;
    }
}
