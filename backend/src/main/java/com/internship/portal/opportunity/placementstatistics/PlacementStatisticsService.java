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

    @Autowired
    private com.internship.portal.student.StudentRepository studentRepository;

    public PlacementStatisticsDTO getStatistics(Long placementCellUserId) {
        // Fetch ALL active opportunities (Global Dashboard view)
        List<Opportunity> opportunities = opportunityRepository.findByIsActiveTrue();

        long totalApplications = 0;
        long rejectedCount = 0;

        for (Opportunity opp : opportunities) {
            List<Application> apps = applicationRepository.findByOpportunityId(opp.getId());
            totalApplications += apps.size();
            rejectedCount += apps.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();
        }

        // Use accurate count from Student entity
        long selectedStudents = studentRepository.countByIsPlacedTrue();

        double acceptanceRate = totalApplications > 0 ? (double) selectedStudents / totalApplications * 100 : 0;

        PlacementStatisticsDTO stats = new PlacementStatisticsDTO();
        stats.setTotalOpportunities((long) opportunities.size());
        stats.setTotalApplications(totalApplications);
        stats.setSelectedStudents(selectedStudents);
        stats.setRejectedApplications(rejectedCount);
        stats.setAcceptanceRate(acceptanceRate);

        return stats;
    }
}
