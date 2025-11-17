package com.aerolinea.service;

import com.aerolinea.model.Avion;
import com.aerolinea.repository.AvionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvionService {

    @Autowired
    private AvionRepository avionRepository;

    public Avion guardar(Avion avion) {
        return avionRepository.save(avion);
    }

    public List<Avion> listar() {
        return avionRepository.findAll();
    }

    public Avion buscarPorId(Integer id) {
        return avionRepository.findById(id).orElse(null);
    }
}
