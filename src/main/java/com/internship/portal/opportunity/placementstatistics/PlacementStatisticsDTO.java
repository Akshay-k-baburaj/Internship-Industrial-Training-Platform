package com.internship.portal.opportunity.placementstatistics;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlacementStatisticsDTO {
    private Long totalOpportunities;
    private Long totalApplications;
    private Long selectedStudents;
    private Long rejectedApplications;
    private Double acceptanceRate;
}
