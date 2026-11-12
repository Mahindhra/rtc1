package com.rtc.backend.controller;

import com.rtc.backend.dto.ApiDtos.*;
import com.rtc.backend.service.PassengerCareService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ComplaintController {
    private final PassengerCareService service;
    public ComplaintController(PassengerCareService service) { this.service = service; }
    @GetMapping("/passenger/dashboard") public DashboardView dashboard(Principal principal) { return service.dashboard(principal.getName()); }
    @GetMapping("/passenger/notifications") public List<NotificationView> notifications(Principal principal) { return service.notifications(principal.getName()); }
    @GetMapping("/passenger/notifications/unread-count") public NotificationCountView unreadCount(Principal principal) { return service.unreadNotificationCount(principal.getName()); }
    @PutMapping("/passenger/notifications/{id}/read") public MessageView readNotification(Principal principal, @PathVariable Long id) {
        service.markNotificationRead(principal.getName(), id);
        return new MessageView("Notification marked as read");
    }
    @PostMapping(value="/complaints", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ComplaintView create(Principal principal, @Valid @RequestPart("complaint") ComplaintRequest request,
                                @RequestPart(value="evidence", required=false) MultipartFile evidence) {
        return service.createComplaint(principal.getName(), request, evidence);
    }
    @GetMapping("/complaints/my") public List<ComplaintView> mine(Principal principal) { return service.passengerComplaints(principal.getName()); }
    @GetMapping("/complaints/{id}") public ComplaintView detail(Principal principal, @PathVariable Long id) { return service.detail(principal.getName(), id); }
    @GetMapping("/complaints/{id}/evidence/{evidenceId}")
    public ResponseEntity<FileSystemResource> evidence(Principal principal, @PathVariable Long id, @PathVariable Long evidenceId) {
        var file = service.evidenceFile(principal.getName(), id, evidenceId);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(file.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.name(), StandardCharsets.UTF_8).build().toString())
                .body(new FileSystemResource(file.path()));
    }
}