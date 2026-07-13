package com.vms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "maintenance_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnoreProperties({"maintenanceRecords"})
    private Vehicle vehicle;

    @NotNull(message = "Service date is required")
    private LocalDate serviceDate;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    @Column(length = 500)
    private String description;

    @PositiveOrZero
    private Double cost;

    @PositiveOrZero
    private Double odometerReading;

    private LocalDate nextServiceDue;
}
