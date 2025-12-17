package com.internship.portal.opportunity.placementstatistics;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@Slf4j
public class PlacementStatisticsController {

    @Autowired
    private PlacementStatisticsService statisticsService;

    @GetMapping("/{placementCellUserId}")
    public ResponseEntity<PlacementStatisticsDTO> getStatistics(@PathVariable Long placementCellUserId) {
        return ResponseEntity.ok(statisticsService.getStatistics(placementCellUserId));
    }
}
