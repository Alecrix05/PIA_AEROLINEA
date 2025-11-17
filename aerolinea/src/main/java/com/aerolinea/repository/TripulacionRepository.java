package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Tripulacion;

public interface TripulacionRepository extends JpaRepository<Tripulacion, Integer> {
}
