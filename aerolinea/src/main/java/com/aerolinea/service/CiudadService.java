package com.aerolinea.service;

import com.aerolinea.model.Ciudad;
import com.aerolinea.repository.CiudadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CiudadService {

    @Autowired
    private CiudadRepository ciudadRepository;

    public Ciudad guardar(Ciudad ciudad) {
        return ciudadRepository.save(ciudad);
    }

    public List<Ciudad> listar() {
        return ciudadRepository.findAll();
    }

    public Ciudad buscarPorId(Integer id) {
        return ciudadRepository.findById(id).orElse(null);
    }

    public Ciudad actualizar(Integer id, Ciudad ciudad) {
        ciudad.setIdCiudad(id);
        return ciudadRepository.save(ciudad);
    }

    public void eliminar(Integer id) {
        ciudadRepository.deleteById(id);
    }
}
