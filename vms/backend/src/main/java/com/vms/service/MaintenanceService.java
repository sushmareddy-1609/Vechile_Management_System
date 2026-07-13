package com.vms.service;

import com.vms.exception.ResourceNotFoundException;
import com.vms.model.MaintenanceRecord;
import com.vms.model.Vehicle;
import com.vms.repository.MaintenanceRecordRepository;
import com.vms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public MaintenanceRecord addRecord(Long vehicleId, MaintenanceRecord record) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));
        record.setId(null);
        record.setVehicle(vehicle);
        return maintenanceRecordRepository.save(record);
    }

    public List<MaintenanceRecord> getRecordsForVehicle(Long vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException("Vehicle not found with id: " + vehicleId);
        }
        return maintenanceRecordRepository.findByVehicleIdOrderByServiceDateDesc(vehicleId);
    }

    @Transactional
    public MaintenanceRecord updateRecord(Long recordId, MaintenanceRecord updated) {
        MaintenanceRecord existing = maintenanceRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with id: " + recordId));

        existing.setServiceDate(updated.getServiceDate());
        existing.setServiceType(updated.getServiceType());
        existing.setDescription(updated.getDescription());
        existing.setCost(updated.getCost());
        existing.setOdometerReading(updated.getOdometerReading());
        existing.setNextServiceDue(updated.getNextServiceDue());

        return maintenanceRecordRepository.save(existing);
    }

    @Transactional
    public void deleteRecord(Long recordId) {
        if (!maintenanceRecordRepository.existsById(recordId)) {
            throw new ResourceNotFoundException("Maintenance record not found with id: " + recordId);
        }
        maintenanceRecordRepository.deleteById(recordId);
    }

    public Double getTotalCostForVehicle(Long vehicleId) {
        return maintenanceRecordRepository.sumCostsByVehicle(vehicleId);
    }
}
