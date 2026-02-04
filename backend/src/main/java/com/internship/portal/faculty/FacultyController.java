package com.internship.portal.faculty;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@Slf4j
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping("/{id}")
    public ResponseEntity<FacultyDTO> getFacultyById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<FacultyDTO> getFacultyByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(facultyService.getFacultyByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<FacultyDTO> createFaculty(@RequestBody FacultyDTO dto) {
        return ResponseEntity.ok(facultyService.createFaculty(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultyDTO> updateFaculty(
            @PathVariable("id") Long id,
            @RequestBody FacultyDTO dto) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, dto));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<FacultyDTO>> getFacultyByDepartment(@PathVariable("department") String department) {
        return ResponseEntity.ok(facultyService.getFacultyByDepartment(department));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<FacultyDashboardStatsDTO> getDashboardStats(@PathVariable("id") Long id) {
        return ResponseEntity.ok(facultyService.getDashboardStats(id));
    }
}
