package com.rtc.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "complaint_evidence")
public class ComplaintEvidence {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Complaint complaint;
    @Column(nullable = false, length = 255)
    private String originalName;
    @Column(nullable = false, length = 500)
    private String storagePath;
    @Column(nullable = false, length = 100)
    private String contentType;
    @Column(nullable = false)
    private Instant uploadedAt = Instant.now();

    protected ComplaintEvidence() {}
    public ComplaintEvidence(Complaint complaint, String originalName, String storagePath, String contentType) {
        this.complaint = complaint;
        this.originalName = originalName;
        this.storagePath = storagePath;
        this.contentType = contentType;
    }
    public Long getId() { return id; }
    public String getOriginalName() { return originalName; }
    public String getStoragePath() { return storagePath; }
    public String getContentType() { return contentType; }
    public Instant getUploadedAt() { return uploadedAt; }
}