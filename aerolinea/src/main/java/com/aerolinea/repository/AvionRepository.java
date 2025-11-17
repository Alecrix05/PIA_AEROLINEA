package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Avion;

public interface AvionRepository extends JpaRepository<Avion, Integer> {
}
