package com.internship.portal.opportunity;

import com.internship.portal.opportunity.enums.OpportunityType;
import com.internship.portal.opportunity.enums.WorkMode;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpportunityDTO {
    private Long id;
    private String title;
    private String description;
    private String companyName;
    private OpportunityType type;
    private String requiredSkills;
    private BigDecimal requiredCgpa;
    private String eligibleDepartments;
    private Integer stipend;
    private String duration;
    private String location;
    private WorkMode workMode;
    private LocalDate deadline;
    private Integer numberOfOpenings;
    private Boolean isActive;
}
