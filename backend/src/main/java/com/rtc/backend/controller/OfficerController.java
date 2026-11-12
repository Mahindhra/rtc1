package com.rtc.backend.controller;

import com.rtc.backend.dto.ApiDtos.*;
import com.rtc.backend.service.PassengerCareService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer")
public class OfficerController {
    private final PassengerCareService service;
    public OfficerController(PassengerCareService service) { this.service = service; }
    @GetMapping("/complaints") public List<ComplaintView> assigned(Principal principal) { return service.officerComplaints(principal.getName()); }
    @PutMapping("/complaints/{id}/status") public ComplaintView update(Principal principal, @PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return service.updateStatus(principal.getName(), id, request);
    }
}