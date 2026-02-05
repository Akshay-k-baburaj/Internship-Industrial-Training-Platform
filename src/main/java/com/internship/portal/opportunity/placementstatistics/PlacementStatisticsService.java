package com.internship.portal.opportunity.placementstatistics;

import com.internship.portal.opportunity.Opportunity;
import com.internship.portal.opportunity.OpportunityRepository;
import com.internship.portal.opportunity.application.Application;
import com.internship.portal.opportunity.application.ApplicationRepository;
import com.internship.portal.opportunity.enums.ApplicationStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Slf4j
public class PlacementStatisticsService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public PlacementStatisticsDTO getStatistics(Long placementCellUserId) {
        List<Opportunity> opportunities = opportunityRepository.findByPostedByIdAndIsActiveTrue(placementCellUserId);

        long totalApplications = 0;
        long selectedCount = 0;
        long rejectedCount = 0;

        double totalCgpa = 0.0;
        long placedCountWithCgpa = 0;
        java.util.Set<Long> uniqueStudentIds = new java.util.HashSet<>();

        for (Opportunity opp : opportunities) {
            List<Application> apps = applicationRepository.findByOpportunityId(opp.getId());
            totalApplications += apps.size();

            for (Application app : apps) {
                uniqueStudentIds.add(app.getStudent().getId());
                if (app.getStatus() == ApplicationStatus.SELECTED) {
                    selectedCount++;
                    if (app.getStudent().getCgpa() != null) {
                        totalCgpa += app.getStudent().getCgpa().doubleValue();
                        placedCountWithCgpa++;
                    }
                } else if (app.getStatus() == ApplicationStatus.REJECTED) {
                    rejectedCount++;
                }
            }
        }

        double acceptanceRate = totalApplications > 0 ? (double) selectedCount / totalApplications * 100 : 0;
        double avgCgpa = placedCountWithCgpa > 0 ? totalCgpa / placedCountWithCgpa : 0.0;

        PlacementStatisticsDTO stats = new PlacementStatisticsDTO();
        stats.setTotalOpportunities((long) opportunities.size());
        stats.setTotalApplications(totalApplications);
        stats.setSelectedStudents(selectedCount);
        stats.setRejectedApplications(rejectedCount);
        stats.setAcceptanceRate(acceptanceRate);
        stats.setAvgCgpa(avgCgpa);
        stats.setTotalStudentsApplied((long) uniqueStudentIds.size());

        return stats;
    }
}
