package com.aerolinea.service;

import com.aerolinea.model.VentaImpuesto;
import com.aerolinea.repository.VentaImpuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaImpuestoService {

    @Autowired
    private VentaImpuestoRepository ventaImpuestoRepository;

    public VentaImpuesto guardar(VentaImpuesto ventaImpuesto) {
        return ventaImpuestoRepository.save(ventaImpuesto);
    }

    public List<VentaImpuesto> listar() {
        return ventaImpuestoRepository.findAll();
    }

    public VentaImpuesto buscarPorId(Integer id) {
        return ventaImpuestoRepository.findById(id).orElse(null);
    }
}
