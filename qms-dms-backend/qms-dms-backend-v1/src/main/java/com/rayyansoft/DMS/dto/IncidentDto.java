package com.rayyansoft.DMS.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IncidentDto {

    private int id;

    private String incNum;

    private String incDate;

    private String createdOn;

    private String reportedOn;

    private int locationId;


    private String reportedBy;

    private String detailsOfIncident;

    private String involvedPerson;

    private String detailsofInvPerson;

    private int serverityId;

    private int floorId;

    private String incTime;

    private String injury;


    private String typeOfInjury;


    private String levelOfHarm;


    private String likelihoodCategory;


    private String medicationError;


    private String externalCommunication;


    private String relativeCommunication;


    private String patientCommunication;


    private String contributeFactorOne;


    private String contributeFactorTwo;

    private String contributeFactorThree;

    private Boolean tAssigned;


    private Long reportedUserId;

    private Long eventCategoryId;
}