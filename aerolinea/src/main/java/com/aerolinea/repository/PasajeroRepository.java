package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Pasajero;
import java.util.List;

public interface PasajeroRepository extends JpaRepository<Pasajero, Integer> {
    List<Pasajero> findByClienteIdCliente(Integer idCliente);
}
