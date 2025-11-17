package com.aerolinea.controller;

import com.aerolinea.model.*;
import com.aerolinea.repository.*;
import com.aerolinea.service.VentaDetalleService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venta-detalle") 
public class VentaDetalleController {

    private final VentaDetalleService service;
    private final VentaEncabezadoRepository ventaRepository;
    private final BoletoRepository boletoRepository;

    public VentaDetalleController(
            VentaDetalleService service,
            VentaEncabezadoRepository ventaRepository,
            BoletoRepository boletoRepository) {
        this.service = service;
        this.ventaRepository = ventaRepository;
        this.boletoRepository = boletoRepository;
    }

    @GetMapping
    public List<VentaDetalle> listar() {
        return service.findAll();
    }

    @PostMapping
    public VentaDetalle agregar(@RequestBody VentaDetalle detalle) {

        if (detalle.getVenta() != null && detalle.getVenta().getIdVenta() != null) {
            detalle.setVenta(
                ventaRepository.findById(detalle.getVenta().getIdVenta()).orElse(null)
            );
        }

        if (detalle.getBoleto() != null && detalle.getBoleto().getIdBoleto() != null) {
            detalle.setBoleto(
                boletoRepository.findById(detalle.getBoleto().getIdBoleto()).orElse(null)
            );
        }

        return service.save(detalle);
    }
}
