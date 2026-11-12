package com.rtc.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 120)
    private String fullName;
    @Column(nullable = false, length = 160)
    private String email;
    @Column(nullable = false, length = 20)
    private String mobileNumber;
    @Column(length = 30)
    private String gender;
    @Column(length = 100)
    private String city;
    @Column(nullable = false)
    private String passwordHash;
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected User() {}
    public User(String fullName, String email, String mobileNumber, String gender, String city, String passwordHash, Role role) {
        this.fullName = fullName;
        this.email = email.toLowerCase();
        this.mobileNumber = mobileNumber;
        this.gender = gender;
        this.city = city;
        this.passwordHash = passwordHash;
        this.role = role;
    }
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getMobileNumber() { return mobileNumber; }
    public String getGender() { return gender; }
    public String getCity() { return city; }
    public String getPasswordHash() { return passwordHash; }
    public Role getRole() { return role; }
    public Instant getCreatedAt() { return createdAt; }
    public void setRole(Role role) { this.role = role; }
}