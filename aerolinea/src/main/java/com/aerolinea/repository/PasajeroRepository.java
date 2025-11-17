package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Pasajero;

public interface PasajeroRepository extends JpaRepository<Pasajero, Integer> {
}
