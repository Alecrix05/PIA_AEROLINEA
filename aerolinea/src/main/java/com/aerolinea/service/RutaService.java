package com.aerolinea.service;

import com.aerolinea.model.Ruta;
import com.aerolinea.repository.RutaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RutaService {

    private final RutaRepository rutaRepository;

    public RutaService(RutaRepository rutaRepository) {
        this.rutaRepository = rutaRepository;
    }

    public List<Ruta> findAll() {
        return rutaRepository.findAll();
    }

    public Ruta save(Ruta ruta) {
        return rutaRepository.save(ruta);
    }
}
