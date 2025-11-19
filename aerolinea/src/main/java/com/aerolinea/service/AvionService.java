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

    public Avion actualizar(Integer id, Avion avion) {
        Avion avionExistente = avionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Avión no encontrado"));
        
        // Solo actualizar campos permitidos, no el ID
        avionExistente.setMatricula(avion.getMatricula());
        avionExistente.setModelo(avion.getModelo());
        avionExistente.setCapacidad(avion.getCapacidad());
        avionExistente.setEstadoOperativo(avion.getEstadoOperativo());
        
        return avionRepository.save(avionExistente);
    }

    public void eliminar(Integer id) {
        avionRepository.deleteById(id);
    }
}
