package com.aerolinea.repository;

import com.aerolinea.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.cliente.idCliente = :idCliente")
    long countByClienteId(@Param("idCliente") Integer idCliente);
}
