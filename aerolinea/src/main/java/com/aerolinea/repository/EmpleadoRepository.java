package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Empleado;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
}
