package com.internship.portal.opportunity.application;

import com.internship.portal.opportunity.enums.ApplicationStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@Slf4j
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<ApplicationDTO> applyForOpportunity(
            @RequestParam("studentId") Long studentId,
            @RequestParam("opportunityId") Long opportunityId,
            @RequestParam(value = "facultyId", required = false) Long facultyId) {
        return ResponseEntity.ok(applicationService.applyForOpportunity(studentId, opportunityId, facultyId));
    }

    @GetMapping("/opportunity/{opportunityId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsForOpportunity(
            @PathVariable("opportunityId") Long opportunityId) {
        return ResponseEntity.ok(applicationService.getApplicationsForOpportunity(opportunityId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByStudent(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("status") ApplicationStatus status,
            @RequestParam("placementCellId") Long placementCellId) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status, placementCellId));
    }

    @PutMapping("/{applicationId}/faculty-approval")
    public ResponseEntity<ApplicationDTO> approveByfaculty(
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("facultyId") Long facultyId,
            @RequestParam("approved") Boolean approved,
            @RequestParam(value = "remarks", required = false) String remarks) {
        return ResponseEntity.ok(applicationService.approveByfaculty(applicationId, facultyId, approved, remarks));
    }

    @GetMapping("/pending-faculty/{facultyId}")
    public ResponseEntity<List<ApplicationDTO>> getPendingFacultyApprovals(@PathVariable("facultyId") Long facultyId) {
        return ResponseEntity.ok(applicationService.getPendingFacultyApprovals(facultyId));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByDepartment(
            @PathVariable("department") String department) {
        return ResponseEntity.ok(applicationService.getApplicationsByDepartment(department));
    }
}
