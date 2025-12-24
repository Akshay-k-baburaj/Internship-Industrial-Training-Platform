package com.internship.portal.placementcell;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlacementCellDTO {
    private Long id;
    private String employeeId;
    private String fullName;
    private String phone;
    private Boolean isActive;
}