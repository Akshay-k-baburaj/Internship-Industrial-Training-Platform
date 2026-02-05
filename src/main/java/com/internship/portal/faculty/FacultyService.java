package com.internship.portal.faculty;

import com.internship.portal.user.Role;
import com.internship.portal.user.User;
import com.internship.portal.user.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    public FacultyDTO createFaculty(FacultyDTO dto) {
        if (dto.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.FACULTY && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("User is not a faculty member");
        }

        Faculty faculty = new Faculty();
        faculty.setUser(user);
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

    public FacultyDTO updateFaculty(Long id, FacultyDTO dto, Long userId) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = faculty.getUser().getId().equals(userId);
        boolean isAdmin = requester.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized to update this faculty profile");
        }

        faculty.setEmployeeId(dto.getEmployeeId());
        faculty.setFullName(dto.getFullName());
        faculty.setDepartment(dto.getDepartment());
        faculty.setDesignation(dto.getDesignation());
        faculty.setPhone(dto.getPhone());

        Faculty updated = facultyRepository.save(faculty);
        return mapToDTO(updated);
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
        dto.setUserId(faculty.getUser().getId());
        dto.setEmployeeId(faculty.getEmployeeId());
        dto.setFullName(faculty.getFullName());
        dto.setDepartment(faculty.getDepartment());
        dto.setDesignation(faculty.getDesignation());
        dto.setPhone(faculty.getPhone());
        return dto;
    }
}
