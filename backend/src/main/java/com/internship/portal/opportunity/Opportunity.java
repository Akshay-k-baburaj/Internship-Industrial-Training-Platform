package com.internship.portal.opportunity;

import com.internship.portal.opportunity.enums.OpportunityType;
import com.internship.portal.opportunity.enums.WorkMode;
import com.internship.portal.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String companyName;

    @Enumerated(EnumType.STRING)
    private OpportunityType type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String requiredSkills;

    @Column(precision = 3, scale = 2)
    private BigDecimal requiredCgpa;

    @Column(columnDefinition = "TEXT")
    private String eligibleDepartments;

    @Column
    private Integer stipend;

    @Column
    private String duration;

    @Column
    private String location;

    @Enumerated(EnumType.STRING)
    private WorkMode workMode;

    @Column(nullable = false)
    private LocalDate deadline;

    @Column
    private Integer numberOfOpenings = 1;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

}
