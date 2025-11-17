package com.aerolinea.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aerolinea.model.Pasajero;
import com.aerolinea.repository.PasajeroRepository;

import java.util.List;

@Service
public class PasajeroService {

    @Autowired
    private PasajeroRepository pasajeroRepository;

    public Pasajero guardar(Pasajero pasajero) {
        return pasajeroRepository.save(pasajero);
    }

    public List<Pasajero> listar() {
        return pasajeroRepository.findAll();
    }

    public Pasajero buscarPorId(Integer id) {
        return pasajeroRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        pasajeroRepository.deleteById(id);
    }
}
