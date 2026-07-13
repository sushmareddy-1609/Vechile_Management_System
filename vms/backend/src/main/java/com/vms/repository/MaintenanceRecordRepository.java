package com.vms.repository;

import com.vms.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {

    List<MaintenanceRecord> findByVehicleIdOrderByServiceDateDesc(Long vehicleId);

    @Query("SELECT COALESCE(SUM(m.cost), 0) FROM MaintenanceRecord m")
    Double sumAllCosts();

    @Query("SELECT COALESCE(SUM(m.cost), 0) FROM MaintenanceRecord m WHERE m.vehicle.id = :vehicleId")
    Double sumCostsByVehicle(Long vehicleId);
}
