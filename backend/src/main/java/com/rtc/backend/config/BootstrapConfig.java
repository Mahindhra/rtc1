package com.rtc.backend.config;

import com.rtc.backend.entity.Role;
import com.rtc.backend.entity.RoleCode;
import com.rtc.backend.repository.RoleRepository;
import com.rtc.backend.entity.User;
import com.rtc.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BootstrapConfig {
    @Bean
    CommandLineRunner seedAdmin(UserRepository users, RoleRepository roles, PasswordEncoder passwords,
                                @Value("${app.seed.admin-email}") String email,
                                @Value("${app.seed.admin-password}") String password) {
        return args -> {
            for (RoleCode code : RoleCode.values()) {
                if (!roles.existsByCode(code)) roles.save(new Role(code, switch (code) {
                    case PASSENGER -> "Passenger";
                    case RTC_OFFICER -> "RTC Officer";
                    case ADMIN -> "Administrator";
                }));
            }
            if (!email.isBlank() && !password.isBlank() && !users.existsByEmail(email.toLowerCase())) {
                Role admin = roles.findByCode(RoleCode.ADMIN).orElseThrow();
                users.save(new User("System Administrator", email.toLowerCase(), "0000000000", null, "RTC", passwords.encode(password), admin));
            }
        };
    }
}