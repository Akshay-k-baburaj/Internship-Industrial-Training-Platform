package com.internship.portal.faculty;

import com.internship.portal.opportunity.application.ApplicationRepository;
import com.internship.portal.opportunity.enums.FacultyApprovalStatus;
import com.internship.portal.student.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class FacultyService {

        @Autowired
        private FacultyRepository facultyRepository;

        @Autowired
        private com.internship.portal.user.UserRepository userRepository;

        @Autowired
        private ApplicationRepository applicationRepository;

        @Autowired
        private StudentRepository studentRepository;

        public FacultyDTO createFaculty(FacultyDTO dto) {
                com.internship.portal.user.User user = userRepository.findById(dto.getUserId())
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "User not found"));

                if (facultyRepository.findByUserId(dto.getUserId()).isPresent()) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.CONFLICT,
                                        "Faculty profile already exists for this user");
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

        public FacultyDTO updateFaculty(Long id, FacultyDTO dto) {
                Faculty faculty = facultyRepository.findById(id)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "Faculty not found"));

                faculty.setFullName(dto.getFullName());
                faculty.setDepartment(dto.getDepartment());
                faculty.setDesignation(dto.getDesignation());
                faculty.setPhone(dto.getPhone());

                Faculty updated = facultyRepository.save(faculty);
                return mapToDTO(updated);
        }

        public FacultyDTO getFacultyById(Long id) {
                Faculty faculty = facultyRepository.findById(id)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "Faculty not found"));
                return mapToDTO(faculty);
        }

        public FacultyDTO getFacultyByUserId(Long userId) {
                Faculty faculty = facultyRepository.findByUserId(userId)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "Faculty not found"));
                return mapToDTO(faculty);
        }

        public List<FacultyDTO> getFacultyByDepartment(String department) {
                return facultyRepository.findByDepartment(department)
                                .stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        public FacultyDashboardStatsDTO getDashboardStats(Long facultyId) {
                Faculty faculty = facultyRepository.findById(facultyId)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "Faculty not found"));

                String dept = faculty.getDepartment();

                long pendingApprovals = applicationRepository
                                .findByStudentDepartmentAndFacultyApprovalStatus(dept, FacultyApprovalStatus.PENDING)
                                .size();

                long studentsReviewed = applicationRepository.countDistinctStudentsByDepartmentAndReviewStatus(
                                dept, Arrays.asList(FacultyApprovalStatus.APPROVED, FacultyApprovalStatus.REJECTED));

                long totalDepartmentStudents = studentRepository.countByDepartment(dept);
                long unplacedStudents = studentRepository.countByDepartmentAndIsPlacedFalse(dept);

                return FacultyDashboardStatsDTO.builder()
                                .pendingApprovals(pendingApprovals)
                                .studentsReviewed(studentsReviewed)
                                .totalDepartmentStudents(totalDepartmentStudents)
                                .unplacedStudents(unplacedStudents)
                                .build();
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