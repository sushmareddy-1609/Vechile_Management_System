package com.vms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalVehicles;
    private long activeVehicles;
    private long inactiveVehicles;
    private long underMaintenanceVehicles;
    private long soldVehicles;
    private Map<String, Long> countByType;
    private Map<String, Long> countByFuelType;
    private List<VehicleSummaryDTO> insuranceExpiringSoon;
    private double totalMaintenanceCost;
}
