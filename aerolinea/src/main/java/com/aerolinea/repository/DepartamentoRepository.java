package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Departamento;

public interface DepartamentoRepository extends JpaRepository<Departamento, Integer> {

}
