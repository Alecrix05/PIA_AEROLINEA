package com.aerolinea.service;

import com.aerolinea.model.Aeropuerto;
import com.aerolinea.repository.AeropuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AeropuertoService {

    @Autowired
    private AeropuertoRepository aeropuertoRepository;

    public Aeropuerto guardar(Aeropuerto aeropuerto) {
        return aeropuertoRepository.save(aeropuerto);
    }

    public List<Aeropuerto> listar() {
        return aeropuertoRepository.findAll();
    }

    public Aeropuerto buscarPorId(Integer id) {
        return aeropuertoRepository.findById(id).orElse(null);
    }

    public Aeropuerto actualizar(Integer id, Aeropuerto aeropuerto) {
        aeropuerto.setIdAeropuerto(id);
        return aeropuertoRepository.save(aeropuerto);
    }

    public void eliminar(Integer id) {
        aeropuertoRepository.deleteById(id);
    }
}
