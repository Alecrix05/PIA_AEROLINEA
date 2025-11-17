package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Vuelo;

public interface VueloRepository extends JpaRepository<Vuelo, Integer> {
}
