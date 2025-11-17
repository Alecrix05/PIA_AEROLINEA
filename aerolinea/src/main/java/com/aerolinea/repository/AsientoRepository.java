package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Asiento;

public interface AsientoRepository extends JpaRepository<Asiento, Integer> {
}
