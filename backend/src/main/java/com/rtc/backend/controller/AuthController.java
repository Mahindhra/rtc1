package com.rtc.backend.controller;

import com.rtc.backend.dto.ApiDtos.*;
import com.rtc.backend.service.PassengerCareService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final PassengerCareService service;
    public AuthController(PassengerCareService service) { this.service = service; }
    @PostMapping("/register") public AuthResponse register(@Valid @RequestBody RegisterRequest request) { return service.register(request); }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest request) { return service.login(request); }
}