package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="taskResponse")
public class TaskResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;


    @Column(name="responseText")
    private String responseText;


    @Column(name="inProgressNotes")
    private String inProgressNotes;

    @Column(name="createdOn")
    private String createdOn;

    @Column(name="updatedOn")
    private String updatedOn;

    @Column(name="statusId")
    private Long statusId;

    @Column(name="respondedBy")
    private Long respondedBy;


    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="respondedBy",insertable=false, updatable=false)
    private User userlist;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="statusId",insertable=false, updatable=false)
    private Status taskStatus;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="taskId")
    private Task task;

    @Column(name="isUserFeedBackDone")
 private Boolean isUserFeedBackDone;

    @Column(name="userFeedBackId")
 private Long userFeedBackId;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="userFeedBackId",insertable=false, updatable=false)
    private UserFeedback userFeedback;




    public void setId(Long id) {
        this.id = id;
    }



    public void setResponseText(String responseText) {
        this.responseText = responseText;
    }

    public void setCreatedOn(String createdOn) {
        this.createdOn = createdOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }

    public void setStatusId(Long statusId) {
        this.statusId = statusId;
    }

    public void setRespondedBy(Long respondedBy) {
        this.respondedBy = respondedBy;
    }


    public Long getId() {
        return id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getResponseText() {
        return responseText;
    }

    public String getCreatedOn() {
        return createdOn;
    }

    public String getUpdatedOn() {
        return updatedOn;
    }

    public Long getRespondedBy() {
        return respondedBy;
    }

    public Status getTaskStatus() {
        return taskStatus;
    }

    public User getUserlist() {
        return userlist;
    }



    public Long getUserFeedBackId() {
        return userFeedBackId;
    }


    public Boolean getUserFeedBackDone() {
        return isUserFeedBackDone;
    }

    public void setUserFeedBackDone(Boolean userFeedBackDone) {
        isUserFeedBackDone = userFeedBackDone;
    }

    public void setUserFeedBackId(Long userFeedBackId) {
        this.userFeedBackId = userFeedBackId;
    }


    public Long getStatusId() {
        return statusId;
    }

    public UserFeedback getUserFeedback() {
        return userFeedback;
    }

    public String getInProgressNotes() {
        return inProgressNotes;
    }

    public void setInProgressNotes(String inProgressNotes) {
        this.inProgressNotes = inProgressNotes;
    }
}
