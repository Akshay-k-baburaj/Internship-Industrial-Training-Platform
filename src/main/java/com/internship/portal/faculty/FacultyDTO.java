package com.internship.portal.faculty;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacultyDTO {
    private Long id;
    private String employeeId;
    private String fullName;
    private String department;
    private String designation;
    private String phone;
}