package com.rtc.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "complaint_status_history")
public class ComplaintStatusHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Complaint complaint;
    @Enumerated(EnumType.STRING) @Column(length = 30)
    private ComplaintStatus previousStatus;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
    private ComplaintStatus newStatus;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User changedBy;
    @Column(length = 2000)
    private String remarks;
    @Column(nullable = false)
    private Instant changedAt = Instant.now();

    protected ComplaintStatusHistory() {}
    public ComplaintStatusHistory(Complaint complaint, ComplaintStatus previousStatus, ComplaintStatus newStatus, User changedBy, String remarks) {
        this.complaint = complaint;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.remarks = remarks;
    }
    public Long getId() { return id; }
    public ComplaintStatus getPreviousStatus() { return previousStatus; }
    public ComplaintStatus getNewStatus() { return newStatus; }
    public User getChangedBy() { return changedBy; }
    public String getRemarks() { return remarks; }
    public Instant getChangedAt() { return changedAt; }
}