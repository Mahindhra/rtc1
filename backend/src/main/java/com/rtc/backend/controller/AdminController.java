package com.rtc.backend.controller;

import com.rtc.backend.dto.ApiDtos.*;
import com.rtc.backend.entity.RoleCode;
import com.rtc.backend.service.PassengerCareService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.security.Principal;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping("/api/admin")
public class AdminController {
    private final PassengerCareService service;
    public AdminController(PassengerCareService service) { this.service = service; }
    @GetMapping("/analytics/summary") public AnalyticsView summary() { return service.analytics(); }
    @GetMapping("/users") public List<UserView> users() { return service.allUsers(); }
    @PutMapping("/users/{id}/role") public UserView role(@PathVariable Long id, @RequestParam @NotNull RoleCode role) { return service.updateUserRole(id, role); }
    @GetMapping("/complaints") public List<ComplaintView> complaints() { return service.allComplaints(); }
    @PutMapping("/complaints/{id}/assign") public ComplaintView assign(Principal principal, @PathVariable Long id, @Valid @RequestBody AssignRequest request) {
        return service.assign(id, request.officerId(), principal.getName());
    }
}