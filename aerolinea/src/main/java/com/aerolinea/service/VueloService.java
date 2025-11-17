package com.aerolinea.service;

import com.aerolinea.model.Vuelo;
import com.aerolinea.repository.VueloRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VueloService {

    private final VueloRepository vueloRepository;

    public VueloService(VueloRepository vueloRepository) {
        this.vueloRepository = vueloRepository;
    }

    public List<Vuelo> findAll() {
        return vueloRepository.findAll();
    }

    public Vuelo findById(Integer id) {
        return vueloRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Vuelo no encontrado con ID: " + id));
    }

    public Vuelo save(Vuelo vuelo) {
        return vueloRepository.save(vuelo);
    }

    public void delete(Integer id) {
        vueloRepository.deleteById(id);
    }
}
