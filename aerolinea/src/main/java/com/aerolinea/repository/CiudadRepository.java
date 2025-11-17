package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Ciudad;

public interface CiudadRepository extends JpaRepository<Ciudad, Integer> {
}
