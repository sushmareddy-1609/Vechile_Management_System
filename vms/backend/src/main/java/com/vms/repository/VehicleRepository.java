package com.vms.repository;

import com.vms.model.Vehicle;
import com.vms.model.VehicleStatus;
import com.vms.model.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);

    Optional<Vehicle> findByRegistrationNumberIgnoreCase(String registrationNumber);

    @Query("""
            SELECT v FROM Vehicle v WHERE
            (:keyword IS NULL OR LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(v.owner) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:type IS NULL OR v.type = :type)
            AND (:status IS NULL OR v.status = :status)
            """)
    Page<Vehicle> search(@Param("keyword") String keyword,
                          @Param("type") VehicleType type,
                          @Param("status") VehicleStatus status,
                          Pageable pageable);

    long countByStatus(VehicleStatus status);

    List<Vehicle> findByInsuranceExpiryDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT v.type as type, COUNT(v) as cnt FROM Vehicle v GROUP BY v.type")
    List<Object[]> countGroupedByType();

    @Query("SELECT v.fuelType as fuelType, COUNT(v) as cnt FROM Vehicle v WHERE v.fuelType IS NOT NULL GROUP BY v.fuelType")
    List<Object[]> countGroupedByFuelType();
}
