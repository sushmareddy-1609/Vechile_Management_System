package com.vms.service;

import com.vms.dto.DashboardStatsDTO;
import com.vms.dto.VehicleSummaryDTO;
import com.vms.exception.DuplicateResourceException;
import com.vms.exception.ResourceNotFoundException;
import com.vms.model.*;
import com.vms.repository.MaintenanceRecordRepository;
import com.vms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumberIgnoreCase(vehicle.getRegistrationNumber())) {
            throw new DuplicateResourceException(
                    "A vehicle with registration number '" + vehicle.getRegistrationNumber() + "' already exists");
        }
        vehicle.setId(null);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    public Page<Vehicle> searchVehicles(String keyword, VehicleType type, VehicleStatus status, Pageable pageable) {
        String cleanKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
        return vehicleRepository.search(cleanKeyword, type, status, pageable);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle updated) {
        Vehicle existing = getVehicleById(id);

        if (!existing.getRegistrationNumber().equalsIgnoreCase(updated.getRegistrationNumber())
                && vehicleRepository.existsByRegistrationNumberIgnoreCase(updated.getRegistrationNumber())) {
            throw new DuplicateResourceException(
                    "A vehicle with registration number '" + updated.getRegistrationNumber() + "' already exists");
        }

        existing.setModel(updated.getModel());
        existing.setBrand(updated.getBrand());
        existing.setOwner(updated.getOwner());
        existing.setRegistrationNumber(updated.getRegistrationNumber());
        existing.setType(updated.getType());
        existing.setFuelType(updated.getFuelType());
        existing.setStatus(updated.getStatus());
        existing.setColor(updated.getColor());
        existing.setManufactureYear(updated.getManufactureYear());
        existing.setMileage(updated.getMileage());
        existing.setPurchaseDate(updated.getPurchaseDate());
        existing.setInsuranceExpiryDate(updated.getInsuranceExpiryDate());
        existing.setNotes(updated.getNotes());

        return vehicleRepository.save(existing);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public DashboardStatsDTO getDashboardStats() {
        long total = vehicleRepository.count();
        long active = vehicleRepository.countByStatus(VehicleStatus.ACTIVE);
        long inactive = vehicleRepository.countByStatus(VehicleStatus.INACTIVE);
        long maintenance = vehicleRepository.countByStatus(VehicleStatus.UNDER_MAINTENANCE);
        long sold = vehicleRepository.countByStatus(VehicleStatus.SOLD);

        Map<String, Long> byType = new LinkedHashMap<>();
        for (Object[] row : vehicleRepository.countGroupedByType()) {
            byType.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Long> byFuel = new LinkedHashMap<>();
        for (Object[] row : vehicleRepository.countGroupedByFuelType()) {
            byFuel.put(String.valueOf(row[0]), (Long) row[1]);
        }

        LocalDate today = LocalDate.now();
        List<VehicleSummaryDTO> expiringSoon = vehicleRepository
                .findByInsuranceExpiryDateBetween(today, today.plusDays(30))
                .stream()
                .map(v -> VehicleSummaryDTO.builder()
                        .id(v.getId())
                        .model(v.getModel())
                        .brand(v.getBrand())
                        .owner(v.getOwner())
                        .registrationNumber(v.getRegistrationNumber())
                        .insuranceExpiryDate(v.getInsuranceExpiryDate())
                        .build())
                .collect(Collectors.toList());

        double totalMaintenanceCost = maintenanceRecordRepository.sumAllCosts();

        return DashboardStatsDTO.builder()
                .totalVehicles(total)
                .activeVehicles(active)
                .inactiveVehicles(inactive)
                .underMaintenanceVehicles(maintenance)
                .soldVehicles(sold)
                .countByType(byType)
                .countByFuelType(byFuel)
                .insuranceExpiringSoon(expiringSoon)
                .totalMaintenanceCost(totalMaintenanceCost)
                .build();
    }

    public String exportToCsv() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Model,Brand,Owner,Registration Number,Type,Fuel Type,Status,Color,Year,Mileage,Purchase Date,Insurance Expiry\n");
        for (Vehicle v : vehicles) {
            sb.append(v.getId()).append(",")
              .append(safe(v.getModel())).append(",")
              .append(safe(v.getBrand())).append(",")
              .append(safe(v.getOwner())).append(",")
              .append(safe(v.getRegistrationNumber())).append(",")
              .append(v.getType()).append(",")
              .append(v.getFuelType()).append(",")
              .append(v.getStatus()).append(",")
              .append(safe(v.getColor())).append(",")
              .append(v.getManufactureYear()).append(",")
              .append(v.getMileage()).append(",")
              .append(v.getPurchaseDate()).append(",")
              .append(v.getInsuranceExpiryDate()).append("\n");
        }
        return sb.toString();
    }

    private String safe(String value) {
        if (value == null) return "";
        return value.contains(",") ? "\"" + value + "\"" : value;
    }
}
