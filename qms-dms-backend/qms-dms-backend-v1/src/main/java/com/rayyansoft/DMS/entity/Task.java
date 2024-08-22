package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="task_mst")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="taskNumber")
    private String taskNumber;

    @Column(name="assignedTo")
    private Long assignedTo;

    @Column(name="createdBy")
    private Long createdBy;

    @Column(name="createdOn")
    private String createdOn;

    @Column(name="taskTypeId")
    private Long taskTypeId;

    @Column(name="taskReferenceId")
    private Long taskReferenceId;

    @Column(name="taskNote")
    private String taskNote;

    @Column(name="dueDate")
    private String dueDate;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="taskReferenceId",insertable=false, updatable=false)
    private Incident incident;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="createdBy",insertable=false, updatable=false)
    private User createdUser;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="taskTypeId",insertable=false, updatable=false)
    private TaskType typeOfTask;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="assignedTo",insertable=false, updatable=false)
    private User assignedUser;

    public void setId(Long id) {
        this.id = id;
    }

    public void setTaskNumber(String taskNumber) {
        this.taskNumber = taskNumber;
    }

    public void setAssignedTo(Long assignedTo) {
        this.assignedTo = assignedTo;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public void setCreatedOn(String createdOn) {
        this.createdOn = createdOn;
    }

    public void setTaskTypeId(Long taskTypeId) {
        this.taskTypeId = taskTypeId;
    }

    public void setTaskReferenceId(Long taskReferenceId) {
        this.taskReferenceId = taskReferenceId;
    }

    public void setTaskNote(String taskNote) {
        this.taskNote = taskNote;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public User getAssignedUser() {
        return assignedUser;
    }
}
