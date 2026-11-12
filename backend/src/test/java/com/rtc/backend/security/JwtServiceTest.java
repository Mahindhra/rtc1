package com.rtc.backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import com.rtc.backend.entity.Role;
import com.rtc.backend.entity.RoleCode;
import com.rtc.backend.entity.User;
import org.junit.jupiter.api.Test;

class JwtServiceTest {
    @Test
    void signsAndReadsTheAccountSubject() {
        JwtService service = new JwtService("a-test-signing-secret-that-is-longer-than-32-bytes", 60_000);
        User user = new User("Passenger", "passenger@example.com", "9876543210", null, "Guntur", "hash", new Role(RoleCode.PASSENGER, "Passenger"));

        String token = service.createToken(user);

        assertEquals("passenger@example.com", service.subject(token));
    }
}