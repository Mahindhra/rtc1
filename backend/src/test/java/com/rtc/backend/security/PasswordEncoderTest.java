package com.rtc.backend.security;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordEncoderTest {
    @Test
    void storesOnlyBcryptHashAndCanVerifyIt() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "Passenger-Care-2026!";
        String hash = encoder.encode(rawPassword);

        assertNotEquals(rawPassword, hash);
        assertTrue(hash.startsWith("$2a$"));
        assertTrue(encoder.matches(rawPassword, hash));
    }
}