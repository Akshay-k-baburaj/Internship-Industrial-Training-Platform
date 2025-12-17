package com.internship.portal.opportunity.eligibility;

import com.internship.portal.opportunity.OpportunityDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/eligibility")
@Slf4j
public class EligibilityController {

    @Autowired
    private EligibilityService eligibilityService;

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkEligibility(
            @RequestParam Long studentId,
            @RequestParam Long opportunityId) {
        return ResponseEntity.ok(eligibilityService.isStudentEligible(studentId, opportunityId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<OpportunityDTO>> getEligibleOpportunities(@PathVariable Long studentId) {
        return ResponseEntity.ok(eligibilityService.getEligibleOpportunitiesForStudent(studentId));
    }
}

