package com.rayyansoft.DMS.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity(name="module")
public class Module {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Id
    private Long id;
    @Column(name="moduelName")
    private String moduleName;

    @Column(name="description")
    private String description;

    @Column(name="createdAt")
    private String createdAt;

    @Column(name="updateAt")
    private String updatedAt;



}
