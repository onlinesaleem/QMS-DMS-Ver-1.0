package com.rayyansoft.DMS.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name="dms.document")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="title")
    private String title;

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;



    @ManyToOne
    private User createdBy;

    @Column(name="createdDate")
    private LocalDate createdDate;

    @Column(name="updateDate")
    private LocalDate updatedDate;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private DocumentStatus status;

    @ManyToOne
    @JoinColumn(name = "updatedBy")
    private User updatedBy;


    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments;
    public enum DocumentStatus {
        DRAFT,
        APPROVED,
        ARCHIVED
    }

    @ManyToOne
    @JoinColumn(name="departmentId", nullable=false)
    private Department documentDepartment;


}
