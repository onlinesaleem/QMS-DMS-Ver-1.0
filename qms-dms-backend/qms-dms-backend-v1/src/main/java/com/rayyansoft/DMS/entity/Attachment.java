package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;


@Entity
@Table(name = "dms.attachment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;


    @Column(name = "file_name", nullable = false,length = 500)
    private String fileName;

    @Column(name = "file_path", nullable = false,length = 1000)
    private String filePath;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "upload_date")
    private Date uploadDate;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    // Fields for flexible reference to any entity (e.g., document, audit, etc.)
    @Column(name = "reference_id", nullable = false)
    private Long referenceId; // ID of the referenced entity (e.g., Document, Audit, etc.)

    @Column(name = "reference_type", nullable = false, length = 50)
    private String referenceType; // Type of reference (e.g., "DOCUMENT", "AUDIT")

    @ManyToOne
    @JoinColumn(name = "audit_id", nullable = true) // Nullable for reusability
    private Audit audit;

    @ManyToOne
    @JoinColumn(name = "audit_response_id")
    private AuditResponse auditResponse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "document_version_id")
    private DocumentVersion documentVersion; // Link to the specific version

    @Override
    public String toString() {
        return "Attachment{" +
                "id=" + id +
                ", fileName='" + fileName + '\'' +
                ", filePath='" + filePath + '\'' +
                ", uploadDate=" + uploadDate +
                ", document=" + document +
                '}';
    }
}
