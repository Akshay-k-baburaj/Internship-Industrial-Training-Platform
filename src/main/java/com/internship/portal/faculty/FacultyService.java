package com.internship.portal.faculty;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public FacultyDTO createFaculty(FacultyDTO dto) {
        Faculty faculty = new Faculty();
        faculty.setEmployeeId(dto.getEmployeeId());
        faculty.setFullName(dto.getFullName());
        faculty.setDepartment(dto.getDepartment());
        faculty.setDesignation(dto.getDesignation());
        faculty.setPhone(dto.getPhone());

        Faculty saved = facultyRepository.save(faculty);
        return mapToDTO(saved);
    }

    public FacultyDTO getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        return mapToDTO(faculty);
    }

    public FacultyDTO getFacultyByUserId(Long userId) {
        Faculty faculty = facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        return mapToDTO(faculty);
    }

    public List<FacultyDTO> getFacultyByDepartment(String department) {
        return facultyRepository.findByDepartment(department)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private FacultyDTO mapToDTO(Faculty faculty) {
        FacultyDTO dto = new FacultyDTO();
        dto.setId(faculty.getId());
        dto.setEmployeeId(faculty.getEmployeeId());
        dto.setFullName(faculty.getFullName());
        dto.setDepartment(faculty.getDepartment());
        dto.setDesignation(faculty.getDesignation());
        dto.setPhone(faculty.getPhone());
        return dto;
    }
}