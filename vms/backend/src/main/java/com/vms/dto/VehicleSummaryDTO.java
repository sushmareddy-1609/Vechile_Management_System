package com.vms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleSummaryDTO {
    private Long id;
    private String model;
    private String brand;
    private String owner;
    private String registrationNumber;
    private LocalDate insuranceExpiryDate;
}
