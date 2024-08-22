package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="qualityResponse")
@Getter
@Setter
public class QualityResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="incId")
    private Long incId;

    @Column(name="notes")
    private String notes;

    @Column(name="finalActionTaken")
    private String finalActionTaken;

    @Column(name="ifNotAppropriate")
    private String ifNotAppropriate;

    @Column(name="updatedOn")
    private String updatedOn;

    @Column(name="updatedUserId")
    private Long updatedUserId;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="incId",insertable=false, updatable=false)
    private Incident incident;

    @ManyToOne(cascade= { CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="updatedUserId",insertable=false, updatable=false)
    private User userQualityResponse;
}
