package com.internship.portal.opportunity.eligibility;

import com.internship.portal.opportunity.Opportunity;
import com.internship.portal.opportunity.OpportunityDTO;
import com.internship.portal.opportunity.OpportunityRepository;
import com.internship.portal.student.Student;
import com.internship.portal.student.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EligibilityService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Boolean isStudentEligible(Long studentId, Long opportunityId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (student.getCgpa().compareTo(opportunity.getRequiredCgpa()) < 0) {
            return false;
        }

        if (opportunity.getEligibleDepartments() != null) {
            String[] departments = opportunity.getEligibleDepartments().split(",");
            boolean departmentMatch = Arrays.stream(departments)
                    .anyMatch(dept -> dept.trim().equalsIgnoreCase(student.getDepartment()));
            if (!departmentMatch) {
                return false;
            }
        }

        return true;
    }

    public List<OpportunityDTO> getEligibleOpportunitiesForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Opportunity> opportunities = opportunityRepository
                .findByEligibleDepartmentsContainingAndRequiredCgpaLessThanEqual(
                        student.getDepartment(), student.getCgpa());

        return opportunities.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private OpportunityDTO mapToDTO(Opportunity opportunity) {
        OpportunityDTO dto = new OpportunityDTO();
        dto.setId(opportunity.getId());
        dto.setTitle(opportunity.getTitle());
        dto.setDescription(opportunity.getDescription());
        dto.setCompanyName(opportunity.getCompanyName());
        dto.setType(opportunity.getType());
        dto.setRequiredSkills(opportunity.getRequiredSkills());
        dto.setRequiredCgpa(opportunity.getRequiredCgpa());
        dto.setEligibleDepartments(opportunity.getEligibleDepartments());
        dto.setStipend(opportunity.getStipend());
        dto.setDuration(opportunity.getDuration());
        dto.setLocation(opportunity.getLocation());
        dto.setWorkMode(opportunity.getWorkMode());
        dto.setDeadline(opportunity.getDeadline());
        dto.setNumberOfOpenings(opportunity.getNumberOfOpenings());
        dto.setIsActive(opportunity.getIsActive());
        return dto;
    }
}

