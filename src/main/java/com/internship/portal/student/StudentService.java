package com.internship.portal.student;

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
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public StudentDTO createStudent(StudentDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

        Student student = new Student();
        student.setUser(user);
        student.setRollNumber(dto.getRollNumber());
        student.setFullName(dto.getFullName());
        student.setDepartment(dto.getDepartment());
        student.setSemester(dto.getSemester());
        student.setCgpa(dto.getCgpa());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setPhone(dto.getPhone());
        student.setSkills(dto.getSkills());
        student.setResumeUrl(dto.getResumeUrl());
        student.setProfileImageUrl(dto.getProfileImageUrl());
        student.setGithubUrl(dto.getGithubUrl());
        student.setLinkedinUrl(dto.getLinkedinUrl());
        student.setPortfolioUrl(dto.getPortfolioUrl());

        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }

    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setFullName(dto.getFullName());
        student.setCgpa(dto.getCgpa());
        student.setPhone(dto.getPhone());
        student.setSkills(dto.getSkills());
        student.setProfileImageUrl(dto.getProfileImageUrl());
        student.setGithubUrl(dto.getGithubUrl());
        student.setLinkedinUrl(dto.getLinkedinUrl());
        student.setPortfolioUrl(dto.getPortfolioUrl());

        Student updated = studentRepository.save(student);
        return mapToDTO(updated);
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return mapToDTO(student);
    }

    public StudentDTO getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return mapToDTO(student);
    }

    public StudentDTO getStudentByRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return mapToDTO(student);
    }

    public List<StudentDTO> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<StudentDTO> getUnplacedStudents() {
        return studentRepository.findByIsPlacedFalse()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setRollNumber(student.getRollNumber());
        dto.setFullName(student.getFullName());
        dto.setDepartment(student.getDepartment());
        dto.setSemester(student.getSemester());
        dto.setCgpa(student.getCgpa());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setPhone(student.getPhone());
        dto.setSkills(student.getSkills());
        dto.setResumeUrl(student.getResumeUrl());
        dto.setProfileImageUrl(student.getProfileImageUrl());
        dto.setGithubUrl(student.getGithubUrl());
        dto.setLinkedinUrl(student.getLinkedinUrl());
        dto.setPortfolioUrl(student.getPortfolioUrl());
        dto.setIsPlaced(student.getIsPlaced());
        return dto;
    }
}