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

        List<Application> findByStudentDepartmentAndFacultyApprovalStatus(String department,
                        FacultyApprovalStatus status);

        List<Application> findByFacultyApprovalStatusAndStatus(FacultyApprovalStatus facultyApprovalStatus,
                        ApplicationStatus status);

        long countByStatusAndOpportunityPostedById(ApplicationStatus status, Long userId);

        @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT a.student) FROM Application a WHERE a.student.department = :department AND a.facultyApprovalStatus IN :statuses")
        long countDistinctStudentsByDepartmentAndReviewStatus(
                        @org.springframework.data.repository.query.Param("department") String department,
                        @org.springframework.data.repository.query.Param("statuses") List<FacultyApprovalStatus> statuses);

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a.student FROM Application a WHERE a.student.department = :department AND a.facultyApprovalStatus IN :statuses")
        List<com.internship.portal.student.Student> findDistinctStudentsByDepartmentAndReviewStatus(
                        @org.springframework.data.repository.query.Param("department") String department,
                        @org.springframework.data.repository.query.Param("statuses") List<FacultyApprovalStatus> statuses);
}
