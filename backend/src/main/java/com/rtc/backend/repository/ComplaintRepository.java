package com.rtc.backend.repository;

import com.rtc.backend.entity.Complaint;
import com.rtc.backend.entity.ComplaintStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByPassengerIdOrderByCreatedAtDesc(Long passengerId);
    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(Long officerId);
    long countByPassengerId(Long passengerId);
    long countByPassengerIdAndStatusIn(Long passengerId, List<ComplaintStatus> statuses);
    long countByStatus(ComplaintStatus status);
    long countByHighPriorityTrue();
    List<Complaint> findAllByOrderByCreatedAtDesc();
}