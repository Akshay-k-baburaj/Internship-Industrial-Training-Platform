package com.internship.portal.student;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private String rollNumber;
    private String fullName;
    private String department;
    private Integer semester;
    private BigDecimal cgpa;
    private LocalDate dateOfBirth;
    private String phone;
    private String skills;
    private String resumeUrl;
    private String profileImageUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private Boolean isPlaced;
}