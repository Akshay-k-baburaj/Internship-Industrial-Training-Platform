package com.internship.portal.opportunity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByIsActiveTrue();
    List<Opportunity> findByPostedByIdAndIsActiveTrue(Long userId);
    List<Opportunity> findByDeadlineAfter(LocalDate date);
    List<Opportunity> findByEligibleDepartmentsContainingAndRequiredCgpaLessThanEqual(
            String department, java.math.BigDecimal cgpa);
}
