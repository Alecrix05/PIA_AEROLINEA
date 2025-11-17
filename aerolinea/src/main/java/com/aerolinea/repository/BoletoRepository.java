package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Boleto;

public interface BoletoRepository extends JpaRepository<Boleto, Integer> {
}
