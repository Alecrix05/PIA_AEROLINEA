package com.aerolinea.service;

import com.aerolinea.model.Impuesto;
import com.aerolinea.repository.ImpuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImpuestoService {

    @Autowired
    private ImpuestoRepository impuestoRepository;

    public Impuesto guardar(Impuesto impuesto) {
        return impuestoRepository.save(impuesto);
    }

    public List<Impuesto> listar() {
        return impuestoRepository.findAll();
    }

    public Impuesto buscarPorId(Integer id) {
        return impuestoRepository.findById(id).orElse(null);
    }
}
