package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Tarifa;

public interface TarifaRepository extends JpaRepository<Tarifa, Integer> {
}
