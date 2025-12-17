package com.internship.portal.opportunity;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@Slf4j
public class OpportunityController {

    @Autowired
    private OpportunityService opportunityService;

    @PostMapping
    public ResponseEntity<OpportunityDTO> createOpportunity(
            @RequestBody OpportunityDTO dto,
            @RequestParam Long postedById) {
        return ResponseEntity.ok(opportunityService.createOpportunity(dto, postedById));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpportunityDTO> updateOpportunity(
            @PathVariable Long id,
            @RequestBody OpportunityDTO dto,
            @RequestParam Long postedById) {
        return ResponseEntity.ok(opportunityService.updateOpportunity(id, dto, postedById));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOpportunity(
            @PathVariable Long id,
            @RequestParam Long postedById) {
        opportunityService.deleteOpportunity(id, postedById);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<OpportunityDTO>> getAllOpportunities() {
        return ResponseEntity.ok(opportunityService.getAllOpportunities());
    }

    @GetMapping("/placementcell/{userId}")
    public ResponseEntity<List<OpportunityDTO>> getOpportunitiesByPlacementCell(@PathVariable Long userId) {
        return ResponseEntity.ok(opportunityService.getOpportunitiesByPlacementCell(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityDTO> getOpportunityById(@PathVariable Long id) {
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }
}
