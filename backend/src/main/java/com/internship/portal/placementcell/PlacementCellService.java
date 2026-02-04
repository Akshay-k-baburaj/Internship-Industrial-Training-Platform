package com.internship.portal.placementcell;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class PlacementCellService {

    @Autowired
    private PlacementCellRepository placementCellRepository;

    public PlacementCellDTO createPlacementCell(PlacementCellDTO dto) {
        PlacementCell cell = new PlacementCell();
        cell.setEmployeeId(dto.getEmployeeId());
        cell.setFullName(dto.getFullName());
        cell.setPhone(dto.getPhone());
        cell.setIsActive(true);

        PlacementCell saved = placementCellRepository.save(cell);
        return mapToDTO(saved);
    }

    public PlacementCellDTO getPlacementCellById(Long id) {
        PlacementCell cell = placementCellRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement Cell not found"));
        return mapToDTO(cell);
    }

    public PlacementCellDTO getPlacementCellByUserId(Long userId) {
        PlacementCell cell = placementCellRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Placement Cell not found"));
        return mapToDTO(cell);
    }

    private PlacementCellDTO mapToDTO(PlacementCell cell) {
        PlacementCellDTO dto = new PlacementCellDTO();
        dto.setId(cell.getId());
        dto.setEmployeeId(cell.getEmployeeId());
        dto.setFullName(cell.getFullName());
        dto.setPhone(cell.getPhone());
        dto.setIsActive(cell.getIsActive());
        return dto;
    }
}