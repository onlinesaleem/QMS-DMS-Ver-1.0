package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name="dms.template")
@Setter
@Getter
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="name")
    private String name;

    @Lob
    @Column(name="content")
    private String content;

    @Column(name="departmentId")
    private Long departmentId;

    @ManyToOne
    private User createdBy;

    @Column(name="createdDate")
    private LocalDate createdDate;

    @ManyToOne
    @JoinColumn(name = "updatedBy")
    private User updatedBy;

    @Column(name="updatedDate")
    private LocalDate updatedDate;

}
