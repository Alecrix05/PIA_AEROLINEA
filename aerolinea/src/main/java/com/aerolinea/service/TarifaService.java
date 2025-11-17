package com.aerolinea.service;

import com.aerolinea.model.Tarifa;
import com.aerolinea.repository.TarifaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarifaService {

    @Autowired
    private TarifaRepository tarifaRepository;

    public Tarifa guardar(Tarifa tarifa) {
        return tarifaRepository.save(tarifa);
    }

    public List<Tarifa> listar() {
        return tarifaRepository.findAll();
    }

    public Tarifa buscarPorId(Integer id) {
        return tarifaRepository.findById(id).orElse(null);
    }
}
