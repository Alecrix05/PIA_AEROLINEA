package com.aerolinea.service;

import com.aerolinea.model.VentaEncabezado;
import com.aerolinea.repository.VentaEncabezadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaEncabezadoService {

    private final VentaEncabezadoRepository ventaRepository;

    public VentaEncabezadoService(VentaEncabezadoRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    public List<VentaEncabezado> getAllVentas() {
        return ventaRepository.findAll();
    }

    public VentaEncabezado getVentaById(Integer id) {
        return ventaRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Venta no encontrada con ID: " + id));
    }

    public VentaEncabezado saveVenta(VentaEncabezado venta) {
        return ventaRepository.save(venta);
    }

    public void deleteVenta(Integer id) {
        ventaRepository.deleteById(id);
    }
}
