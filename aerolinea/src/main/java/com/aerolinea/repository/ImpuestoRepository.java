package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Impuesto;

public interface ImpuestoRepository extends JpaRepository<Impuesto, Integer> {
}
