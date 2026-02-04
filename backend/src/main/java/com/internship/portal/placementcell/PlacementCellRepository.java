package com.internship.portal.placementcell;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlacementCellRepository extends JpaRepository<PlacementCell, Long> {
    Optional<PlacementCell> findByUserId(Long userId);
    Optional<PlacementCell> findByEmployeeId(String employeeId);
}