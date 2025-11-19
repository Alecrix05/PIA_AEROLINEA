package com.aerolinea.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aerolinea.model.Asiento;
import java.util.List;

public interface AsientoRepository extends JpaRepository<Asiento, Integer> {
    List<Asiento> findByAvionIdAvion(Integer idAvion);
}
