package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="documentType")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="documentType")
    private String documentType;

    @Column(name="active")
    private Boolean active;


}
