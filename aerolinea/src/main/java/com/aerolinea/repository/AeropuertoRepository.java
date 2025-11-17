package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Aeropuerto;

public interface AeropuertoRepository extends JpaRepository<Aeropuerto, Integer> {
}
