package com.rtc.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints", uniqueConstraints = @UniqueConstraint(columnNames = "complaintNumber"))
public class Complaint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 24)
    private String complaintNumber;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User passenger;
    @Column(nullable = false, length = 60)
    private String category;
    @Column(length = 30)
    private String busNumber;
    @Column(length = 150)
    private String busRoute;
    private LocalDate journeyDate;
    @Column(length = 180)
    private String location;
    @Column(nullable = false, length = 3000)
    private String description;
    @Column(nullable = false)
    private boolean highPriority;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
    private ComplaintStatus status = ComplaintStatus.SUBMITTED;
    @Column(length = 2000)
    private String investigationRemarks;
    @ManyToOne(fetch = FetchType.LAZY)
    private User assignedOfficer;
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComplaintStatusHistory> statusHistory = new ArrayList<>();
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComplaintEvidence> evidence = new ArrayList<>();

    protected Complaint() {}
    public Complaint(String complaintNumber, User passenger, String category, String busNumber, String busRoute,
                     LocalDate journeyDate, String location, String description, boolean highPriority) {
        this.complaintNumber = complaintNumber;
        this.passenger = passenger;
        this.category = category;
        this.busNumber = busNumber;
        this.busRoute = busRoute;
        this.journeyDate = journeyDate;
        this.location = location;
        this.description = description;
        this.highPriority = highPriority;
    }
    public void changeStatus(ComplaintStatus next, User actor, String remarks) {
        ComplaintStatus previous = status;
        status = next;
        updatedAt = Instant.now();
        if (remarks != null && !remarks.isBlank()) investigationRemarks = remarks;
        statusHistory.add(new ComplaintStatusHistory(this, previous, next, actor, remarks));
    }
    public void assign(User officer, User actor) {
        assignedOfficer = officer;
        changeStatus(ComplaintStatus.ASSIGNED, actor, "Assigned to " + officer.getFullName());
    }
    public void addEvidence(ComplaintEvidence item) { evidence.add(item); }
    public Long getId() { return id; }
    public String getComplaintNumber() { return complaintNumber; }
    public User getPassenger() { return passenger; }
    public String getCategory() { return category; }
    public String getBusNumber() { return busNumber; }
    public String getBusRoute() { return busRoute; }
    public LocalDate getJourneyDate() { return journeyDate; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public boolean isHighPriority() { return highPriority; }
    public ComplaintStatus getStatus() { return status; }
    public String getInvestigationRemarks() { return investigationRemarks; }
    public User getAssignedOfficer() { return assignedOfficer; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<ComplaintStatusHistory> getStatusHistory() { return statusHistory; }
    public List<ComplaintEvidence> getEvidence() { return evidence; }
}