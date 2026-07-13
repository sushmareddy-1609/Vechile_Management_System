package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.model.MaintenanceRecord;
import com.vms.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/vehicles/{vehicleId}/maintenance")
    public ResponseEntity<ApiResponse<MaintenanceRecord>> addRecord(
            @PathVariable Long vehicleId, @Valid @RequestBody MaintenanceRecord record) {
        MaintenanceRecord created = maintenanceService.addRecord(vehicleId, record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Maintenance record added", created));
    }

    @GetMapping("/vehicles/{vehicleId}/maintenance")
    public ResponseEntity<ApiResponse<List<MaintenanceRecord>>> getRecords(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(
                ApiResponse.success("Maintenance records retrieved", maintenanceService.getRecordsForVehicle(vehicleId)));
    }

    @PutMapping("/maintenance/{recordId}")
    public ResponseEntity<ApiResponse<MaintenanceRecord>> updateRecord(
            @PathVariable Long recordId, @Valid @RequestBody MaintenanceRecord record) {
        return ResponseEntity.ok(
                ApiResponse.success("Maintenance record updated", maintenanceService.updateRecord(recordId, record)));
    }

    @DeleteMapping("/maintenance/{recordId}")
    public ResponseEntity<ApiResponse<Object>> deleteRecord(@PathVariable Long recordId) {
        maintenanceService.deleteRecord(recordId);
        return ResponseEntity.ok(ApiResponse.success("Maintenance record deleted", null));
    }

    @GetMapping("/vehicles/{vehicleId}/maintenance/total-cost")
    public ResponseEntity<ApiResponse<Double>> totalCost(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(ApiResponse.success("Total cost retrieved",
                maintenanceService.getTotalCostForVehicle(vehicleId)));
    }
}
