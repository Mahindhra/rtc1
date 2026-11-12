package com.rtc.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
    private RoleCode code;
    @Column(nullable = false, length = 80)
    private String label;
    protected Role() {}
    public Role(RoleCode code, String label) { this.code = code; this.label = label; }
    public Long getId() { return id; }
    public RoleCode getCode() { return code; }
    public String getLabel() { return label; }
}