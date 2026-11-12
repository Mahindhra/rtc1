package com.rtc.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User recipient;
    @ManyToOne(fetch = FetchType.LAZY)
    private Complaint complaint;
    @Column(nullable = false, length = 200)
    private String message;
    @Column(name = "is_read", nullable = false)
    private boolean read;
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    protected Notification() {}
    public Notification(User recipient, Complaint complaint, String message) { this.recipient = recipient; this.complaint = complaint; this.message = message; }
    public Long getId() { return id; }
    public String getMessage() { return message; }
    public Long getComplaintId() { return complaint == null ? null : complaint.getId(); }
    public Instant getCreatedAt() { return createdAt; }
    public boolean isRead() { return read; }
    public Long getRecipientId() { return recipient.getId(); }
    public void markRead() { read = true; }
}