package com.rtc.backend.repository;

import com.rtc.backend.entity.Role;
import com.rtc.backend.entity.RoleCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByCode(RoleCode code);
    boolean existsByCode(RoleCode code);
}