package com.aerolinea.service;

import com.aerolinea.model.Asiento;
import com.aerolinea.repository.AsientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AsientoService {

    @Autowired
    private AsientoRepository asientoRepository;

    public Asiento guardar(Asiento asiento) {
        return asientoRepository.save(asiento);
    }

    public List<Asiento> listar() {
        return asientoRepository.findAll();
    }

    public Asiento buscarPorId(Integer id) {
        return asientoRepository.findById(id).orElse(null);
    }
}
