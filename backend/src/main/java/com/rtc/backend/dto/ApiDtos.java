package com.rtc.backend.dto;

import com.rtc.backend.entity.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public final class ApiDtos {
    private ApiDtos() {}
    public record RegisterRequest(@NotBlank @Size(max=120) String fullName, @NotBlank @Email @Size(max=160) String email,
                                  @NotBlank @Pattern(regexp="^[0-9+() -]{7,20}$") String mobileNumber,
                                  @Size(max=30) String gender, @Size(max=100) String city,
                                  @NotBlank @Size(min=8,max=72) String password) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record AuthResponse(String token, UserView user) {}
    public record UserView(Long id, String fullName, String email, String mobileNumber, RoleCode role, String city) {
        public static UserView from(User user) { return new UserView(user.getId(), user.getFullName(), user.getEmail(), user.getMobileNumber(), user.getRole().getCode(), user.getCity()); }
    }
    public record ComplaintRequest(@NotBlank String category, @Size(max=30) String busNumber, @Size(max=150) String busRoute,
                                   LocalDate journeyDate, @Size(max=180) String location, @NotBlank @Size(max=3000) String description) {}
    public record StatusRequest(@NotNull ComplaintStatus status, @Size(max=2000) String remarks) {}
    public record AssignRequest(@NotNull Long officerId) {}
    public record HistoryView(ComplaintStatus from, ComplaintStatus to, String changedBy, String remarks, Instant changedAt) {}
    public record EvidenceView(Long id, String name, String contentType, Instant uploadedAt) {}
    public record ComplaintView(Long id, String complaintNumber, Long passengerId, String passengerName, String category,
                                String busNumber, String busRoute, LocalDate journeyDate, String location, String description,
                                boolean highPriority, ComplaintStatus status, String investigationRemarks,
                                Long assignedOfficerId, String assignedOfficerName, Instant createdAt, Instant updatedAt,
                                List<HistoryView> history, List<EvidenceView> evidence) {
        public static ComplaintView from(Complaint complaint) {
            return new ComplaintView(complaint.getId(), complaint.getComplaintNumber(), complaint.getPassenger().getId(),
                    complaint.getPassenger().getFullName(), complaint.getCategory(), complaint.getBusNumber(), complaint.getBusRoute(),
                    complaint.getJourneyDate(), complaint.getLocation(), complaint.getDescription(), complaint.isHighPriority(),
                    complaint.getStatus(), complaint.getInvestigationRemarks(),
                    complaint.getAssignedOfficer() == null ? null : complaint.getAssignedOfficer().getId(),
                    complaint.getAssignedOfficer() == null ? null : complaint.getAssignedOfficer().getFullName(),
                    complaint.getCreatedAt(), complaint.getUpdatedAt(),
                    complaint.getStatusHistory().stream().map(item -> new HistoryView(item.getPreviousStatus(), item.getNewStatus(),
                            item.getChangedBy().getFullName(), item.getRemarks(), item.getChangedAt())).toList(),
                    complaint.getEvidence().stream().map(item -> new EvidenceView(item.getId(), item.getOriginalName(), item.getContentType(), item.getUploadedAt())).toList());
        }
    }
    public record DashboardView(String fullName, long total, long pending, long investigation, long resolved, List<ComplaintView> recent) {}
    public record AnalyticsView(long users, long passengers, long officers, long complaints, long pending, long resolved, long highPriority) {}
    public record MessageView(String message) {}
    public record NotificationView(Long id, String message, Long complaintId, Instant createdAt, boolean read) {
        public static NotificationView from(Notification notification) { return new NotificationView(notification.getId(), notification.getMessage(), notification.getComplaintId(), notification.getCreatedAt(), notification.isRead()); }
    }
    public record NotificationCountView(long unread) {}
}