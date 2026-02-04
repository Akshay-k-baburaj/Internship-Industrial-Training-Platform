package com.internship.portal.faculty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyDashboardStatsDTO {
    private long pendingApprovals;
    private long studentsReviewed;
    private long totalDepartmentStudents;
    private long unplacedStudents;
}
