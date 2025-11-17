package com.aerolinea.service;

import com.aerolinea.model.VentaDetalle;
import com.aerolinea.repository.VentaDetalleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaDetalleService {

    private final VentaDetalleRepository repository;

    public VentaDetalleService(VentaDetalleRepository repository) {
        this.repository = repository;
    }

    public List<VentaDetalle> findAll() {
        return repository.findAll();
    }

    public VentaDetalle save(VentaDetalle detalle) {
        return repository.save(detalle);
    }
}
