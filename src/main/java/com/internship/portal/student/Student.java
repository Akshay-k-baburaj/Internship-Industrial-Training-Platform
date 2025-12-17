package com.internship.portal.student;

import com.internship.portal.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(unique = true, nullable = false)
    private String rollNumber;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String department;

    @Column
    private Integer semester;

    @Column(precision = 3, scale = 2)
    private BigDecimal cgpa;

    @Column
    private LocalDate dateOfBirth;

    @Column
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(nullable = false)
    private String resumeUrl;

    @Column
    private String profileImageUrl;

    @Column
    private String githubUrl;

    @Column
    private String linkedinUrl;

    @Column
    private String portfolioUrl;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isPlaced = false;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

}
