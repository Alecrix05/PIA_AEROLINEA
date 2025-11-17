package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.VentaImpuesto;

public interface VentaImpuestoRepository extends JpaRepository<VentaImpuesto, Integer> {
}
