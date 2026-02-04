package com.internship.portal.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);

    Optional<Student> findByRollNumber(String rollNumber);

    List<Student> findByDepartment(String department);

    long countByDepartment(String department);

    long countByDepartmentAndIsPlacedFalse(String department);

    List<Student> findByIsPlacedFalse();

    List<Student> findByDepartmentAndIsPlacedFalse(String department);

    long countByIsPlacedTrue();
}