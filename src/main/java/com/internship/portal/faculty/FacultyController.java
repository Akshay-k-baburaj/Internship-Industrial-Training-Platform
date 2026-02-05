package com.internship.portal.faculty;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/faculty")
@Slf4j
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping("/{id}")
    public ResponseEntity<FacultyDTO> getFacultyById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<FacultyDTO> getFacultyByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(facultyService.getFacultyByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<FacultyDTO> createFaculty(
            @RequestBody FacultyDTO dto,
            @RequestParam Long userId) {
        dto.setUserId(userId);
        return ResponseEntity.ok(facultyService.createFaculty(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultyDTO> updateFaculty(
            @PathVariable Long id,
            @RequestBody FacultyDTO dto,
            @RequestParam Long userId) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, dto, userId));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<FacultyDTO>> getFacultyByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(facultyService.getFacultyByDepartment(department));
    }
}
