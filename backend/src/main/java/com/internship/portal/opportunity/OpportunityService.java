package com.internship.portal.opportunity;

import com.internship.portal.user.User;
import com.internship.portal.user.UserRepository;
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
public class OpportunityService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private UserRepository userRepository;

    public OpportunityDTO createOpportunity(OpportunityDTO dto, Long postedById) {
        User user = userRepository.findById(postedById)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Opportunity opportunity = new Opportunity();
        opportunity.setTitle(dto.getTitle());
        opportunity.setDescription(dto.getDescription());
        opportunity.setCompanyName(dto.getCompanyName());
        opportunity.setType(dto.getType());
        opportunity.setRequiredSkills(dto.getRequiredSkills());
        opportunity.setRequiredCgpa(dto.getRequiredCgpa());
        opportunity.setEligibleDepartments(dto.getEligibleDepartments());
        opportunity.setStipend(dto.getStipend());
        opportunity.setDuration(dto.getDuration());
        opportunity.setLocation(dto.getLocation());
        opportunity.setWorkMode(dto.getWorkMode());
        opportunity.setDeadline(dto.getDeadline());
        opportunity.setNumberOfOpenings(dto.getNumberOfOpenings());
        opportunity.setIsActive(true);
        opportunity.setPostedBy(user);
        opportunity.setCreatedAt(LocalDateTime.now());
        opportunity.setUpdatedAt(LocalDateTime.now());

        Opportunity saved = opportunityRepository.save(opportunity);
        return mapToDTO(saved);
    }

    public OpportunityDTO updateOpportunity(Long id, OpportunityDTO dto, Long postedById) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (!opportunity.getPostedBy().getId().equals(postedById)) {
            throw new RuntimeException("Unauthorized to update this opportunity");
        }

        opportunity.setTitle(dto.getTitle());
        opportunity.setDescription(dto.getDescription());
        opportunity.setCompanyName(dto.getCompanyName());
        opportunity.setType(dto.getType());
        opportunity.setRequiredSkills(dto.getRequiredSkills());
        opportunity.setRequiredCgpa(dto.getRequiredCgpa());
        opportunity.setEligibleDepartments(dto.getEligibleDepartments());
        opportunity.setStipend(dto.getStipend());
        opportunity.setDuration(dto.getDuration());
        opportunity.setLocation(dto.getLocation());
        opportunity.setWorkMode(dto.getWorkMode());
        opportunity.setDeadline(dto.getDeadline());
        opportunity.setNumberOfOpenings(dto.getNumberOfOpenings());
        opportunity.setUpdatedAt(LocalDateTime.now());

        Opportunity updated = opportunityRepository.save(opportunity);
        return mapToDTO(updated);
    }

    public void deleteOpportunity(Long id, Long postedById) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (!opportunity.getPostedBy().getId().equals(postedById)) {
            throw new RuntimeException("Unauthorized to delete this opportunity");
        }

        opportunity.setIsActive(false);
        opportunity.setUpdatedAt(LocalDateTime.now());
        opportunityRepository.save(opportunity);
    }

    public List<OpportunityDTO> getAllOpportunities() {
        return opportunityRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<OpportunityDTO> getOpportunitiesByPlacementCell(Long userId) {
        return opportunityRepository.findByPostedByIdAndIsActiveTrue(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OpportunityDTO getOpportunityById(Long id) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        return mapToDTO(opportunity);
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

