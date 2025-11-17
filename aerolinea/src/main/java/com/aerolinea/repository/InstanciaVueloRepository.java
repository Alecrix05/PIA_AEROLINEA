package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.InstanciaVuelo;

public interface InstanciaVueloRepository extends JpaRepository<InstanciaVuelo, Integer> {
}
