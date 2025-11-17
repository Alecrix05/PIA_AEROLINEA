package com.aerolinea.service;

import com.aerolinea.model.InstanciaVuelo;
import com.aerolinea.repository.InstanciaVueloRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InstanciaVueloService {

    private final InstanciaVueloRepository instanciaVueloRepository;

    public InstanciaVueloService(InstanciaVueloRepository instanciaVueloRepository) {
        this.instanciaVueloRepository = instanciaVueloRepository;
    }

    public List<InstanciaVuelo> findAll() {
        return instanciaVueloRepository.findAll();
    }

    public InstanciaVuelo findById(Integer id) {
        return instanciaVueloRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Instancia de vuelo no encontrada con ID: " + id));
    }

    public InstanciaVuelo save(InstanciaVuelo instanciaVuelo) {
        // Validación adicional de fechas (además de @PrePersist)
        if (instanciaVuelo.getFechaSalida() != null && instanciaVuelo.getFechaLlegada() != null) {
            if (instanciaVuelo.getFechaLlegada().isBefore(instanciaVuelo.getFechaSalida()) || 
                instanciaVuelo.getFechaLlegada().isEqual(instanciaVuelo.getFechaSalida())) {
                throw new IllegalArgumentException("La fecha de llegada debe ser posterior a la fecha de salida");
            }
            
            // Validación: la salida debe ser al menos 30 minutos después de ahora
            if (instanciaVuelo.getIdInstanciaVuelo() == null) { // Solo en creación
                LocalDateTime minimoSalida = LocalDateTime.now().plusMinutes(30);
                if (instanciaVuelo.getFechaSalida().isBefore(minimoSalida)) {
                    throw new IllegalArgumentException("La fecha de salida debe ser al menos 30 minutos en el futuro");
                }
            }
        }
        
        return instanciaVueloRepository.save(instanciaVuelo);
    }

    public void delete(Integer id) {
        instanciaVueloRepository.deleteById(id);
    }
}
