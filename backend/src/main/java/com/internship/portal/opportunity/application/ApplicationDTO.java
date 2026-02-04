package com.internship.portal.opportunity.application;

import com.internship.portal.opportunity.enums.ApplicationStatus;
import com.internship.portal.opportunity.enums.FacultyApprovalStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private String studentDepartment;
    private java.math.BigDecimal studentCgpa;
    private String studentResumeUrl;
    private Long opportunityId;
    private String opportunityTitle;
    private String companyName;
    private ApplicationStatus status;
    private FacultyApprovalStatus facultyApprovalStatus;
    private String remarks;
    private LocalDateTime appliedAt;
}
