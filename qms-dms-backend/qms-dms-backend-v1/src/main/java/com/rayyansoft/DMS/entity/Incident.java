package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="incident_mst")
public class Incident {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name="id")
    private long id;

    @Column(name="inc-num")
    private String incNum;

    @Column(name="inc_date")
    private String incDate;

    @Column(name="incTime")
    private String incTime;
    @Column(name="created_on")
    private String createdOn;

    @Column(name="reported_on")
    private String reportedOn;

    @Column(name="locationId")
    private Long locationId;

    @Column(name="floorId")
    private Long floorId;

    @Column(name="reported_by")
    private String reportedBy;

    @Column(name="dtls-incident")
    private String detailsOfIncident;


    @Column(name="invl-person")
    private String involvedPerson;

    @Column(name="dtls-invperson")
    private String detailsofInvPerson;

    @Column(name="serverityId")
    private Long serverityId;

    @Column(name="statusId")
    private Long statusId;

    @Column(name="injury")
    private String injury;

    @Column(name="typeOfInjury")
    private String typeOfInjury;

    @Column(name="levelOfHarm")
    private String levelOfHarm;

    @Column(name="likelihoodCategory")
    private String likelihoodCategory;

    @Column(name="medicationError")
    private String medicationError;

    @Column(name="externalCommunication")
    private String externalCommunication;

    @Column(name="relativeCommunication")
    private String relativeCommunication;

    @Column(name="patientCommunication")
    private String patientCommunication;

    @Column(name="contributeFactorOne")
    private String contributeFactorOne;

    @Column(name="contributeFactorTwo")
    private String contributeFactorTwo;

    @Column(name="contributeFactorThree")
    private String contributeFactorThree;

    @Column(name="eventCategoryId")
    private Long eventCategoryId;



    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="floorId",insertable=false, updatable=false)
    private Floor incfloor;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="locationId",insertable=false, updatable=false)
    private Location inclocation;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="serverityId",insertable=false, updatable=false)
    private Severity incseverity;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="statusId",insertable=false, updatable=false)
    private Status incStatus;

    @Column(name="tAssigned")
    private Boolean tAssigned;

    @Column(name="reportedUserId")
    private Long reportedUserId;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="eventCategoryId",insertable=false, updatable=false)
    private IncEventCategory incEventCategory;

    public void setId(long id) {
        this.id = id;
    }

    public void setIncNum(String incNum) {
        this.incNum = incNum;
    }

    public void setIncDate(String incDate) {
        this.incDate = incDate;
    }

    public void setCreatedOn(String createdOn) {
        this.createdOn = createdOn;
    }

    public void setReportedOn(String reportedOn) {
        this.reportedOn = reportedOn;
    }


    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public void setFloorId(Long floorId) {
        this.floorId = floorId;
    }

    public void setServerityId(Long serverityId) {
        this.serverityId = serverityId;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

    public void setDetailsOfIncident(String detailsOfIncident) {
        this.detailsOfIncident = detailsOfIncident;
    }

    public void setInvolvedPerson(String involvedPerson) {
        this.involvedPerson = involvedPerson;
    }

    public void setDetailsofInvPerson(String detailsofInvPerson) {
        this.detailsofInvPerson = detailsofInvPerson;
    }




    public void setIncTime(String incTime) {
        this.incTime = incTime;
    }

    public void setStatusId(Long statusId) {
        this.statusId = statusId;
    }

    public void setInjury(String injury) {
        this.injury = injury;
    }

    public void setTypeOfInjury(String typeOfInjury) {
        this.typeOfInjury = typeOfInjury;
    }

    public void setLevelOfHarm(String levelOfHarm) {
        this.levelOfHarm = levelOfHarm;
    }

    public void setLikelihoodCategory(String likelihoodCategory) {
        this.likelihoodCategory = likelihoodCategory;
    }

    public void setMedicationError(String medicationError) {
        this.medicationError = medicationError;
    }

    public void setExternalCommunication(String externalCommunication) {
        this.externalCommunication = externalCommunication;
    }

    public void setRelativeCommunication(String relativeCommunication) {
        this.relativeCommunication = relativeCommunication;
    }

    public void setPatientCommunication(String patientCommunication) {
        this.patientCommunication = patientCommunication;
    }

    public void setContributeFactorOne(String contributeFactorOne) {
        this.contributeFactorOne = contributeFactorOne;
    }

    public void setContributeFactorTwo(String contributeFactorTwo) {
        this.contributeFactorTwo = contributeFactorTwo;
    }

    public void setContributeFactorThree(String contributeFactorThree) {
        this.contributeFactorThree = contributeFactorThree;
    }

    public void settAssigned(Boolean tAssigned) {
        this.tAssigned = tAssigned;
    }

    public void setReportedUserId(Long reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public void setEventCategoryId(Long eventCategoryId) {
        this.eventCategoryId = eventCategoryId;
    }



}
