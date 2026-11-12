package com.rtc.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "officer_assignments")
public class OfficerAssignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Complaint complaint;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User officer;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User assignedBy;
    @Column(nullable = false)
    private Instant assignedAt = Instant.now();
    protected OfficerAssignment() {}
    public OfficerAssignment(Complaint complaint, User officer, User assignedBy) { this.complaint = complaint; this.officer = officer; this.assignedBy = assignedBy; }
}