package com.rtc.backend.service;

import com.rtc.backend.dto.ApiDtos.*;
import com.rtc.backend.entity.*;
import com.rtc.backend.repository.ComplaintRepository;
import com.rtc.backend.repository.NotificationRepository;
import com.rtc.backend.repository.OfficerAssignmentRepository;
import com.rtc.backend.repository.RoleRepository;
import com.rtc.backend.repository.UserRepository;
import com.rtc.backend.security.JwtService;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PassengerCareService {
    public record EvidenceFile(Path path, String name, String contentType) {}
    private static final List<String> CATEGORIES = List.of("Bus Not Stopping", "Rash Driving", "Rude Driver/Conductor", "Overcrowding", "Dirty Bus", "Ticket Issues", "Harassment", "Lost Belongings", "Late Bus", "Route Deviation", "Other");
    private static final List<ComplaintStatus> OPEN = List.of(ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, ComplaintStatus.ASSIGNED, ComplaintStatus.INVESTIGATION);
    private final UserRepository users;
    private final RoleRepository roles;
    private final NotificationRepository notifications;
    private final OfficerAssignmentRepository assignments;
    private final ComplaintRepository complaints;
    private final PasswordEncoder passwords;
    private final JwtService jwt;
    private final Path uploadDir;
    public PassengerCareService(UserRepository users, RoleRepository roles, ComplaintRepository complaints, NotificationRepository notifications,
                               OfficerAssignmentRepository assignments, PasswordEncoder passwords, JwtService jwt,
                               @Value("${app.upload-dir}") String uploadDir) {
        this.users = users; this.roles = roles; this.complaints = complaints; this.notifications = notifications; this.assignments = assignments;
        this.passwords = passwords; this.jwt = jwt; this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
    }
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) throw new IllegalArgumentException("An account with this email already exists");
        User user = users.save(new User(request.fullName().trim(), email, request.mobileNumber().trim(), request.gender(), request.city(), passwords.encode(request.password()), role(RoleCode.PASSENGER)));
        return new AuthResponse(jwt.createToken(user), UserView.from(user));
    }
    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(request.email().trim().toLowerCase()).orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!passwords.matches(request.password(), user.getPasswordHash())) throw new BadCredentialsException("Invalid credentials");
        return new AuthResponse(jwt.createToken(user), UserView.from(user));
    }
    public User current(String email) { return users.findByEmail(email).orElseThrow(() -> new NoSuchElementException("Account not found")); }
    @Transactional
    public ComplaintView createComplaint(String email, ComplaintRequest request, MultipartFile file) {
        User passenger = current(email);
        if (passenger.getRole().getCode() != RoleCode.PASSENGER) throw new IllegalArgumentException("Only passengers can submit complaints");
        if (!CATEGORIES.contains(request.category())) throw new IllegalArgumentException("Select a valid complaint category");
        if (file != null && !file.isEmpty() && (file.getSize() > 5_000_000 || !List.of("image/jpeg", "image/png", "application/pdf").contains(file.getContentType())))
            throw new IllegalArgumentException("Evidence must be a JPG, PNG, or PDF file under 5 MB");
        String number = "RTC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        boolean priority = request.category().equals("Harassment") || request.category().equals("Rash Driving");
        Complaint complaint = new Complaint(number, passenger, request.category(), request.busNumber(), request.busRoute(), request.journeyDate(), request.location(), request.description().trim(), priority);
        complaint.changeStatus(ComplaintStatus.SUBMITTED, passenger, "Complaint submitted");
        if (file != null && !file.isEmpty()) {
            try {
                Files.createDirectories(uploadDir);
                String safeName = UUID.randomUUID() + extension(file.getOriginalFilename());
                Path destination = uploadDir.resolve(safeName).normalize();
                if (!destination.startsWith(uploadDir)) throw new IllegalArgumentException("Invalid evidence filename");
                file.transferTo(destination);
                complaint.addEvidence(new ComplaintEvidence(complaint, file.getOriginalFilename(), safeName, file.getContentType()));
            } catch (IOException exception) { throw new IllegalArgumentException("Evidence could not be stored"); }
        }
        Complaint saved = complaints.save(complaint);
        notifications.save(new Notification(passenger, saved, "Your complaint " + number + " has been submitted."));
        return ComplaintView.from(saved);
    }
    private String extension(String name) {
        if (name == null || !name.contains(".")) return "";
        String ext = name.substring(name.lastIndexOf('.')).toLowerCase();
        return List.of(".jpg", ".jpeg", ".png", ".pdf").contains(ext) ? ext : "";
    }
    @Transactional
    public List<ComplaintView> passengerComplaints(String email) {
        User user = current(email);
        return complaints.findByPassengerIdOrderByCreatedAtDesc(user.getId()).stream().map(ComplaintView::from).toList();
    }
    @Transactional
    public ComplaintView detail(String email, Long id) {
        User user = current(email);
        Complaint complaint = complaints.findById(id).orElseThrow(() -> new NoSuchElementException("Complaint not found"));
        if (user.getRole().getCode() == RoleCode.PASSENGER && !complaint.getPassenger().getId().equals(user.getId())) throw new NoSuchElementException("Complaint not found");
        if (user.getRole().getCode() == RoleCode.RTC_OFFICER && (complaint.getAssignedOfficer() == null || !complaint.getAssignedOfficer().getId().equals(user.getId()))) throw new NoSuchElementException("Complaint not found");
        return ComplaintView.from(complaint);
    }
    @Transactional
    public DashboardView dashboard(String email) {
        User passenger = current(email);
        List<Complaint> rows = complaints.findByPassengerIdOrderByCreatedAtDesc(passenger.getId());
        return new DashboardView(passenger.getFullName(), rows.size(), rows.stream().filter(c -> OPEN.contains(c.getStatus())).count(),
                rows.stream().filter(c -> c.getStatus() == ComplaintStatus.INVESTIGATION).count(),
                rows.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED).count(),
                rows.stream().limit(5).map(ComplaintView::from).toList());
    }
    @Transactional
    public List<ComplaintView> officerComplaints(String email) {
        User officer = current(email);
        return complaints.findByAssignedOfficerIdOrderByCreatedAtDesc(officer.getId()).stream().map(ComplaintView::from).toList();
    }
    @Transactional
    public ComplaintView updateStatus(String email, Long id, StatusRequest request) {
        User officer = current(email);
        Complaint complaint = complaints.findById(id).orElseThrow(() -> new NoSuchElementException("Complaint not found"));
        if (complaint.getAssignedOfficer() == null || !complaint.getAssignedOfficer().getId().equals(officer.getId())) throw new NoSuchElementException("Complaint not found");
        ComplaintStatus next = request.status();
        boolean allowed = switch (complaint.getStatus()) {
            case ASSIGNED -> next == ComplaintStatus.UNDER_REVIEW || next == ComplaintStatus.INVESTIGATION;
            case UNDER_REVIEW -> next == ComplaintStatus.INVESTIGATION;
            case INVESTIGATION -> next == ComplaintStatus.RESOLVED;
            case RESOLVED -> next == ComplaintStatus.CLOSED || next == ComplaintStatus.INVESTIGATION;
            default -> false;
        };
        if (!allowed) throw new IllegalArgumentException("That status transition is not allowed");
        if (next == ComplaintStatus.RESOLVED && (request.remarks() == null || request.remarks().isBlank())) throw new IllegalArgumentException("Add resolution remarks before resolving");
        complaint.changeStatus(next, officer, request.remarks());
        notifications.save(new Notification(complaint.getPassenger(), complaint, "Your complaint " + complaint.getComplaintNumber() + " is now " + next.name().replace('_', ' ').toLowerCase() + "."));
        return ComplaintView.from(complaint);
    }
    public AnalyticsView analytics() {
        return new AnalyticsView(users.count(), users.countByRole_Code(RoleCode.PASSENGER), users.countByRole_Code(RoleCode.RTC_OFFICER), complaints.count(),
                complaints.countByStatus(ComplaintStatus.SUBMITTED) + complaints.countByStatus(ComplaintStatus.UNDER_REVIEW) + complaints.countByStatus(ComplaintStatus.ASSIGNED) + complaints.countByStatus(ComplaintStatus.INVESTIGATION),
                complaints.countByStatus(ComplaintStatus.RESOLVED) + complaints.countByStatus(ComplaintStatus.CLOSED), complaints.countByHighPriorityTrue());
    }
    @Transactional
    public List<ComplaintView> allComplaints() { return complaints.findAllByOrderByCreatedAtDesc().stream().map(ComplaintView::from).toList(); }
    public List<UserView> allUsers() { return users.findAllByOrderByCreatedAtDesc().stream().map(UserView::from).toList(); }
    @Transactional
    public ComplaintView assign(Long complaintId, Long officerId, String adminEmail) {
        User admin = current(adminEmail);
        User officer = users.findById(officerId).orElseThrow(() -> new NoSuchElementException("RTC officer not found"));
        if (officer.getRole().getCode() != RoleCode.RTC_OFFICER) throw new IllegalArgumentException("Select an RTC officer");
        Complaint complaint = complaints.findById(complaintId).orElseThrow(() -> new NoSuchElementException("Complaint not found"));
        if (complaint.getStatus() == ComplaintStatus.SUBMITTED) complaint.changeStatus(ComplaintStatus.UNDER_REVIEW, admin, "Initial review completed; case ready for assignment");
        complaint.assign(officer, admin);
        assignments.save(new OfficerAssignment(complaint, officer, admin));
        notifications.save(new Notification(complaint.getPassenger(), complaint, "Your complaint " + complaint.getComplaintNumber() + " has been assigned for review."));
        return ComplaintView.from(complaint);
    }
    public UserView updateUserRole(Long userId, RoleCode roleCode) {
        User user = users.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setRole(role(roleCode));
        return UserView.from(users.save(user));
    }
    private Role role(RoleCode code) { return roles.findByCode(code).orElseThrow(() -> new IllegalStateException("Role catalog is not initialized")); }
    @Transactional
    public List<NotificationView> notifications(String email) {
        User user = current(email);
        return notifications.findByRecipientIdOrderByCreatedAtDesc(user.getId()).stream().map(NotificationView::from).toList();
    }
    @Transactional
    public NotificationCountView unreadNotificationCount(String email) {
        User user = current(email);
        return new NotificationCountView(notifications.countByRecipientIdAndReadFalse(user.getId()));
    }
    @Transactional
    public void markNotificationRead(String email, Long id) {
        User user = current(email);
        Notification notification = notifications.findByIdAndRecipientId(id, user.getId()).orElseThrow(() -> new NoSuchElementException("Notification not found"));
        notification.markRead();
    }
    @Transactional
    public EvidenceFile evidenceFile(String email, Long complaintId, Long evidenceId) {
        detail(email, complaintId);
        Complaint complaint = complaints.findById(complaintId).orElseThrow(() -> new NoSuchElementException("Complaint not found"));
        ComplaintEvidence evidence = complaint.getEvidence().stream().filter(item -> item.getId().equals(evidenceId)).findFirst()
                .orElseThrow(() -> new NoSuchElementException("Evidence not found"));
        Path path = uploadDir.resolve(evidence.getStoragePath()).normalize();
        if (!path.startsWith(uploadDir) || !Files.isRegularFile(path)) throw new NoSuchElementException("Evidence file not found");
        return new EvidenceFile(path, evidence.getOriginalName(), evidence.getContentType());
    }
}