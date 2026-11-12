package com.rtc.backend.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class ComplaintTest {
    @Test
    void recordsEveryStatusChangeWithTheActorAndRemarks() {
        User passenger = new User("Passenger", "p@example.com", "9876543210", null, "Guntur", "hash", new Role(RoleCode.PASSENGER, "Passenger"));
        User officer = new User("Officer", "o@example.com", "9876543211", null, "Guntur", "hash", new Role(RoleCode.RTC_OFFICER, "RTC Officer"));
        Complaint complaint = new Complaint("RTC-12345678", passenger, "Late Bus", "AP 16 Z 1234", "Guntur - Vijayawada", null, "Guntur", "The service was delayed for an hour.", false);

        complaint.changeStatus(ComplaintStatus.SUBMITTED, passenger, "Complaint submitted");
        complaint.changeStatus(ComplaintStatus.INVESTIGATION, officer, "Depot team contacted");

        assertEquals(ComplaintStatus.INVESTIGATION, complaint.getStatus());
        assertEquals(2, complaint.getStatusHistory().size());
        assertEquals("Depot team contacted", complaint.getStatusHistory().get(1).getRemarks());
    }
}