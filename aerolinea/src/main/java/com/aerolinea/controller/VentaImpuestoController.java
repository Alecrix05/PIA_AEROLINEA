package com.aerolinea.controller;

import com.aerolinea.model.VentaImpuesto;
import com.aerolinea.service.VentaImpuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venta-impuestos")
public class VentaImpuestoController {

    @Autowired
    private VentaImpuestoService ventaImpuestoService;

    @GetMapping
    public List<VentaImpuesto> listar() {
        return ventaImpuestoService.listar();
    }

    @GetMapping("/{id}")
    public VentaImpuesto obtener(@PathVariable Integer id) {
        return ventaImpuestoService.buscarPorId(id);
    }

    @PostMapping
    public VentaImpuesto crear(@RequestBody VentaImpuesto ventaImpuesto) {
        return ventaImpuestoService.guardar(ventaImpuesto);
    }
}
