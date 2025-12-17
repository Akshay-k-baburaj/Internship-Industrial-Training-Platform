package com.internship.portal.opportunity.application;

import com.internship.portal.opportunity.enums.ApplicationStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Slf4j
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<ApplicationDTO> applyForOpportunity(
            @RequestParam Long studentId,
            @RequestParam Long opportunityId) {
        return ResponseEntity.ok(applicationService.applyForOpportunity(studentId, opportunityId));
    }

    @GetMapping("/opportunity/{opportunityId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsForOpportunity(@PathVariable Long opportunityId) {
        return ResponseEntity.ok(applicationService.getApplicationsForOpportunity(opportunityId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            @RequestParam Long placementCellId) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status, placementCellId));
    }

    @PutMapping("/{applicationId}/faculty-approval")
    public ResponseEntity<ApplicationDTO> approveByfaculty(
            @PathVariable Long applicationId,
            @RequestParam Long facultyId,
            @RequestParam Boolean approved,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(applicationService.approveByfaculty(applicationId, facultyId, approved, remarks));
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<List<ApplicationDTO>> getPendingFacultyApprovals() {
        return ResponseEntity.ok(applicationService.getPendingFacultyApprovals());
    }
}

