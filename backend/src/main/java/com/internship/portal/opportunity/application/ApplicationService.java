package com.internship.portal.opportunity.application;

import com.internship.portal.opportunity.Opportunity;
import com.internship.portal.opportunity.OpportunityRepository;
import com.internship.portal.opportunity.enums.ApplicationStatus;
import com.internship.portal.opportunity.enums.FacultyApprovalStatus;
import com.internship.portal.student.Student;
import com.internship.portal.student.StudentRepository;
import com.internship.portal.faculty.Faculty;
import com.internship.portal.faculty.FacultyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public ApplicationDTO applyForOpportunity(Long studentId, Long opportunityId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (applicationRepository.findByStudentIdAndOpportunityId(studentId, opportunityId).isPresent()) {
            throw new RuntimeException("Already applied for this opportunity");
        }

        if (student.getCgpa().compareTo(opportunity.getRequiredCgpa()) < 0) {
            throw new RuntimeException("CGPA not sufficient");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setOpportunity(opportunity);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setFacultyApprovalStatus(FacultyApprovalStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        Application saved = applicationRepository.save(application);
        return mapToDTO(saved);
    }

    public List<ApplicationDTO> getApplicationsForOpportunity(Long opportunityId) {
        return applicationRepository.findByOpportunityId(opportunityId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ApplicationDTO updateApplicationStatus(Long applicationId, ApplicationStatus status, Long placementCellId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getOpportunity().getPostedBy().getId().equals(placementCellId)) {
            throw new RuntimeException("Unauthorized to update this application");
        }

        application.setStatus(status);
        application.setUpdatedAt(LocalDateTime.now());

        Application updated = applicationRepository.save(application);
        return mapToDTO(updated);
    }

    public ApplicationDTO approveByfaculty(Long applicationId, Long facultyId, Boolean approved, String remarks) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        application.setApprovedByFaculty(faculty);
        application
                .setFacultyApprovalStatus(approved ? FacultyApprovalStatus.APPROVED : FacultyApprovalStatus.REJECTED);
        application.setRemarks(remarks);
        application.setUpdatedAt(LocalDateTime.now());

        Application updated = applicationRepository.save(application);
        return mapToDTO(updated);
    }

    public List<ApplicationDTO> getPendingFacultyApprovals() {
        return applicationRepository.findByFacultyApprovalStatusAndApprovedByFacultyNull(FacultyApprovalStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getPendingApplicationsByDepartment(String department) {
        return applicationRepository
                .findByStudentDepartmentAndFacultyApprovalStatus(department, FacultyApprovalStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getAllApplications() {
        return applicationRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ApplicationDTO getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return mapToDTO(application);
    }

    public List<ApplicationDTO> getApprovedApplicationsForVerification() {
        return applicationRepository.findByFacultyApprovalStatusAndStatus(
                FacultyApprovalStatus.APPROVED, ApplicationStatus.APPLIED)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<com.internship.portal.student.StudentDTO> getReviewedStudentsByDepartment(String department) {
        return applicationRepository.findDistinctStudentsByDepartmentAndReviewStatus(
                department, java.util.Arrays.asList(FacultyApprovalStatus.APPROVED, FacultyApprovalStatus.REJECTED))
                .stream()
                .map(student -> {
                    com.internship.portal.student.StudentDTO dto = new com.internship.portal.student.StudentDTO();
                    dto.setId(student.getId());
                    dto.setUserId(student.getUser().getId());
                    dto.setRollNumber(student.getRollNumber());
                    dto.setFullName(student.getFullName());
                    dto.setDepartment(student.getDepartment());
                    dto.setSemester(student.getSemester());
                    dto.setCgpa(student.getCgpa());
                    dto.setDateOfBirth(student.getDateOfBirth());
                    dto.setPhone(student.getPhone());
                    dto.setSkills(student.getSkills());
                    dto.setResumeUrl(student.getResumeUrl());
                    dto.setProfileImageUrl(student.getProfileImageUrl());
                    dto.setGithubUrl(student.getGithubUrl());
                    dto.setLinkedinUrl(student.getLinkedinUrl());
                    dto.setPortfolioUrl(student.getPortfolioUrl());
                    dto.setIsPlaced(student.getIsPlaced());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ApplicationDTO verifyPlacement(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getFacultyApprovalStatus() != FacultyApprovalStatus.APPROVED) {
            throw new RuntimeException("Application must be approved by faculty first");
        }

        // 1. Mark this application as SELECTED (Placed)
        application.setStatus(ApplicationStatus.SELECTED);
        application.setUpdatedAt(LocalDateTime.now());
        Application saved = applicationRepository.save(application);

        // 1.1 Mark the Student as Placed
        Student student = application.getStudent();
        student.setIsPlaced(true);
        studentRepository.save(student);

        // 2. Reject all other pending/approved applications for this student
        List<Application> otherApplications = applicationRepository.findByStudentId(application.getStudent().getId());
        for (Application app : otherApplications) {
            if (!app.getId().equals(applicationId) && app.getStatus() != ApplicationStatus.SELECTED) {
                app.setStatus(ApplicationStatus.REJECTED);
                app.setRemarks("Auto-rejected: Student placed in " + application.getOpportunity().getCompanyName());
                app.setUpdatedAt(LocalDateTime.now());
                applicationRepository.save(app);
            }
        }

        return mapToDTO(saved);
    }

    private ApplicationDTO mapToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setStudentId(application.getStudent().getId());
        dto.setStudentName(application.getStudent().getFullName());
        dto.setStudentRollNumber(application.getStudent().getRollNumber());
        dto.setStudentDepartment(application.getStudent().getDepartment());
        dto.setStudentCgpa(application.getStudent().getCgpa());
        dto.setStudentResumeUrl(application.getStudent().getResumeUrl());
        dto.setOpportunityId(application.getOpportunity().getId());
        dto.setOpportunityTitle(application.getOpportunity().getTitle());
        dto.setCompanyName(application.getOpportunity().getCompanyName());
        dto.setStatus(application.getStatus());
        dto.setFacultyApprovalStatus(application.getFacultyApprovalStatus());
        dto.setRemarks(application.getRemarks());
        dto.setAppliedAt(application.getAppliedAt());
        return dto;
    }
}
