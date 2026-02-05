package com.internship.portal.opportunity.application;

import com.internship.portal.opportunity.enums.ApplicationStatus;
import com.internship.portal.opportunity.enums.FacultyApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
        List<Application> findByOpportunityId(Long opportunityId);

        List<Application> findByStudentId(Long studentId);

        List<Application> findByStatusAndOpportunityPostedById(ApplicationStatus status, Long userId);

        Optional<Application> findByStudentIdAndOpportunityId(Long studentId, Long opportunityId);

        List<Application> findByFacultyApprovalStatusAndApprovedByFacultyNull(FacultyApprovalStatus status);

        List<Application> findByFacultyApprovalStatusAndApprovedByFacultyId(FacultyApprovalStatus status,
                        Long facultyId);

        @org.springframework.data.jpa.repository.Query("SELECT a FROM Application a JOIN a.student s WHERE s.department = :department")
        List<Application> findByStudentDepartment(
                        @org.springframework.data.repository.query.Param("department") String department);

        @org.springframework.data.jpa.repository.Query("SELECT a FROM Application a JOIN a.student s WHERE s.department = :department AND a.facultyApprovalStatus = :status")
        List<Application> findByStudentDepartmentAndFacultyApprovalStatus(
                        @org.springframework.data.repository.query.Param("department") String department,
                        @org.springframework.data.repository.query.Param("status") FacultyApprovalStatus status);

        long countByStatusAndOpportunityPostedById(ApplicationStatus status, Long userId);
}
