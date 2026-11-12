package com.rtc.backend.repository;

import com.rtc.backend.entity.RoleCode;
import com.rtc.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole_Code(RoleCode code);
    List<User> findAllByOrderByCreatedAtDesc();
}